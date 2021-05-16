<template>
    <div>
        <h1 class="title text-purple">
            Ceru's Unbound cost calculator
        </h1>
        <h3 class="subtitle text-gray-lighter">
            Unoffical cost calculator
        </h3>
        <hr/>
        <div class="card ~info mt-4 mb-12">
            <b>
                ☁ Explaining the costs
            </b></br>
            <p>
                Unbound is a bit more complex to calculate costs for and so I have built this tool to help people get a better understanding of the pricing model.<Br/><br/>
                <b>🚗 Requests:</b>
                First 1 million requests are free, these are counted if they hit your Worker. With DDoS protection, any requests rejected by Cloudflare will NOT count towards this number.
                Even if your Worker has an error, it will count towards this number.
                <br/><br/>
                <b>🐏 Memory:</b> First 400,000-GBs is free. Each Worker you execute uses 128mb of memory, this is not changable yet. You are charged per millisecond the Worker runs.<br/><br/>
                <b>⚡ Egress (Bandwidth):</b> First 5GB free, costs $0.045 per Gigabyte sent to/from your Worker.<br/>
            </p>
        </div>
        <hr/>
        <div class="flex flex-row mb-8 items-center">
            <h1 class="title text-purple block  flex-grow">
                Total: ${{(total / 100).toFixed(2)}}
            </h1>

            <a class="rounded-lg bg-purple text-white px-4 py-1 cursor-pointer flex flex-row items-center" style="border-radius:0.375rem;" @click="share">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Share
            </a>
        </div>
        <o-field v-if="ready" class="mb-4" :label="`How many requests do you expect to process per month? ($${(pricing.requests / 100).toFixed(2)})`" message="Includes errors, redirects, and successful requests. Costs $0.15/million requests.">
            <o-slider v-model="amount_of_reqs" :max="10000000" :step="100000"></o-slider>
        </o-field>

        <o-field v-if="ready" :label="`How long does your Worker run for on average? (${human.intComma(pricing.memory_used)}GB-s) ($${(pricing.memory / 100).toFixed(2)})`" message="Counted in seconds, rounded up. Costs $12.50/million GB-s.">
            <o-slider v-model="seconds_per_req" :max="30" :step="0.25" :min="1" :custom-formatter="val => val + ' seconds'"></o-slider>
        </o-field>
        
        <o-field v-if="ready" class="mb-4" :label="`How much data are you sending per request? (${pricing.egress_out}GB) ($${(pricing.egress / 100).toFixed(2)})`" message="Any data your Worker receaves or sends out. Costs $0.045/GB.">
            <o-slider v-model="egress" :max="128000" :step="1024" :min="1024" :custom-formatter="val => humanize.filesize(val)"></o-slider>
        </o-field>
    </div>
</template> 

<script>
    var human = require('humanize-plus')
    var humanize = require('humanize')

    export default {
        data: () => ({
            human,
            humanize,
            ready: false,
            pricing: {
                requests: 0,
                memory: 0,
                egress: 0,
            },
            rates: {
                requests: 15,
                memory: 1250,
                egress: 4.5,
            },
            amount_of_reqs: 100000,
            seconds_per_req: 1,
            egress: 1024,
            total: 0,
        }),
        watch: {
            amount_of_reqs() {this.work_out_cost()},
            seconds_per_req() {this.work_out_cost()},
            egress() {this.work_out_cost()},
        },
        methods: {
            share() {
                this.$router.push({ path: '/', query: { rpm: this.amount_of_reqs, spr: this.seconds_per_req, egress: this.egress }})
            },
            setMeta() {
                document.querySelectorAll('[data-metadata]').forEach(el => el.remove())
                const create_tag = (name, content) => {
                    (['', 'og:', 'twitter:']).forEach(prefix => {
                        var link = document.createElement('meta')
                        link.setAttribute('property', prefix + name)
                        link.content = content
                        link.setAttribute('data-metadata', '1')
                        document.getElementsByTagName('head')[0].appendChild(link)
                    })
                }

                create_tag('title', 'Cloudflare Workers: Unbound pricing calculator')
                create_tag('description', `Requests per month: $${(this.pricing.requests / 100).toFixed(2)}\nMemory used: $${(this.pricing.memory / 100).toFixed(2)}\nEgress: $${(this.pricing.egress / 100).toFixed(2)}\nTotal per month: $${(this.total / 100).toFixed(2)}`)
                create_tag('theme-color', '#9561e2')
            },
            work_out_cost() {
                if (!this.ready) {return}
                var total = 500 // $5 minimum payment required.

                // If amount of requests is under 1 mil, ignore.
                if (this.amount_of_reqs > 1000000) {
                    this.pricing.requests = parseFloat(((this.amount_of_reqs - 1000000) * (this.rates.requests / 1000000)).toFixed(3))
                    total = total + this.pricing.requests
                } else {
                    this.pricing.requests = 0 
                }

                // Work out Gigabyte seconds.
                // Convert requests to megabytes used.
                var memory_used_mb = this.amount_of_reqs * 128
                memory_used_mb = memory_used_mb * this.seconds_per_req

                var gigabytes_used = (memory_used_mb / 1000) // Convert MB-s to GB-s

                gigabytes_used = Math.max(gigabytes_used - 400000, 0)

                this.pricing.memory_used = gigabytes_used
                this.pricing.memory = gigabytes_used * (this.rates.memory / 1000000)

                total += this.pricing.memory

                // Work out egress costs
                // We count egress in bytes so first convert Bytes to Gigabytes.
                var one_gigabyte = 1000000000
                var gigabyte_per_request = (this.egress  * this.amount_of_reqs) / one_gigabyte
                gigabyte_per_request = gigabyte_per_request - 5

                var egress_cost = (Math.max(gigabyte_per_request, 0)) * (this.rates.egress)

                this.pricing.egress = egress_cost
                this.pricing.egress_out = (Math.max(gigabyte_per_request, 0)).toFixed(2)

                total = total + egress_cost

                this.total = total

                this.setMeta()
            },
        },
        mounted() {
            this.amount_of_reqs = parseInt(this.$route.query.rpm || '100000')
            this.seconds_per_req = parseFloat(this.$route.query.spr || '1')
            this.egress = parseInt(this.$route.query.egress || '1024')
            this.ready = true
            this.$nextTick(this.work_out_cost)
        }
    }
</script>
