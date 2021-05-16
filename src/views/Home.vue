<template>
    <div class="">
        <o-modal :active.sync="show_preview_modal">
            <h4 class="title">
                Test your Worker
            </h4>
            <p>
                You can use this tool to test a Worker's response time and size to see how much you would need to pay.
            </p>
            <hr/>
            <o-field class="mt-8" label="URL of the Worker" message="Please make sure it is publicly accessable, otherwise we cant check it!">
                <input class="field my-2" v-model="preview_url" @keypress.enter="test_preview"></input>
            </o-field>
            <a @click="test_preview" class="rounded-lg w-full flex items-center justify-center bg-purple text-white mr-2 px-4 py-2 cursor-pointer flex flex-row items-center" style="border-radius:0.375rem;">
                Test URL
            </a>
        </o-modal>
        <div class="flex flex-row items-center">
            <div class="flex-grow">
                <h1 class="title text-purple">
                    Unbound cost calculator
                </h1>
                <h3 class="subtitle text-gray-lighter">
                    Built by Cerulean, unofficial Workers pricing calculator 
                </h3>
            </div>
            <a href="https://github.com/AggressivelyMeows/workers-unbound-pricing" target="_blank">
                <svg width="24" height="24" fill="currentColor" class="text-purple mr-3"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"></path></svg>
            </a>
            <a href="https://twitter.com/ceruthedev" target="_blank">
                <svg width="20" height="20" fill="currentColor" class="text-purple"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path></svg>
            </a>
        </div>
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

            <a v-if="mode == 'advanced'" @click="mode = 'simple'" class="rounded-lg bg-purple text-white mr-2 px-4 py-2 cursor-pointer flex flex-row items-center" style="border-radius:0.375rem;">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Simple
            </a>

            <a v-else @click="mode = 'advanced'" class="rounded-lg bg-purple text-white mr-2 px-4 py-2 cursor-pointer flex flex-row items-center" style="border-radius:0.375rem;">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Advanced
            </a>

            <a class="rounded-lg bg-purple text-white mr-2 px-4 py-2 cursor-pointer flex flex-row items-center" style="border-radius:0.375rem;" @click="show_preview_modal = true">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Test Worker
            </a>

            <a class="rounded-lg bg-purple text-white px-4 py-2 cursor-pointer flex flex-row items-center" style="border-radius:0.375rem;" @click="share">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Share
            </a>
        </div>
        <o-field v-if="ready" class="mb-4" :label="`How many requests do you expect to process per month? ($${(pricing.requests / 100).toFixed(2)})`" message="Includes errors, redirects, and successful requests. Costs $0.15/million requests.">
            <o-slider v-if="mode == 'simple'" v-model="amount_of_reqs" :max="10000000" :step="100000"></o-slider>
            <vue-numeric currency="" v-if="mode == 'advanced'" class="field w-full my-2" v-model="amount_of_reqs" separator=","></vue-numeric>
        </o-field>

        <o-field v-if="ready" :label="`How long does your Worker run for on average? (${human.intComma(pricing.memory_used)}GB-s) ($${(pricing.memory / 100).toFixed(2)})`" :message="`${mode == 'advanced' ? 'Advanced mode: Use decimal to show milliseconds.' : ''} Counted in seconds. Costs $12.50/million GB-s.`">
            <o-slider v-if="mode == 'simple'" v-model="seconds_per_req" :max="30" :step="0.25" :min="0.25" :custom-formatter="val => val + ' seconds'"></o-slider>
            <input v-if="mode == 'advanced'" type="number" class="field w-full my-2" :min="0.50" v-model="seconds_per_req" ></input>
        </o-field>
        
        <o-field v-if="ready" class="mb-4" :label="`How much data are you sending per request? (${pricing.egress_out}GB) ($${(pricing.egress / 100).toFixed(2)})`" :message="`${mode == 'advanced' ? 'Advanced mode: This input accepts the length of bytes only, you need to need to convert from KB/MB/GB to bytes first! ' : ''}Any data your Worker receives or sends out. Costs $0.045/GB.`">
            <o-slider v-if="mode == 'simple'" v-model="egress" :max="Math.max(128000, egress)" :step="1024" :min="1024" :custom-formatter="val => humanize.filesize(val)"></o-slider>
            <input v-if="mode == 'advanced'" type="number" class="field w-full my-2" v-model="egress" ></input>
        </o-field>

        <div class="mt-24">
            <p class="text-grey-dark text-center text-xs">
                This website is not affliated with Cloudflare. Information on this page is just an estimate and your prices may be different to the results.<br/>
                If you need help, or wish to hire me, you can contact me via Twitter (top right), or email:
                ceru@sponsus.org<br/>
            </p>
        </div>
    </div>
</template> 

<script>
    import VueNumeric from 'vue-numeric'
    var human = require('humanize-plus')
    var humanize = require('humanize')

    export default {
        data: () => ({
            human,
            humanize,
            mode: 'simple',
            ready: false,
            show_preview_modal: false,
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
            preview_url: '',
            loading_preview: false,
            preview_results: {}
        }),
        watch: {
            amount_of_reqs() {this.work_out_cost()},
            seconds_per_req() {this.work_out_cost()},
            egress() {this.work_out_cost()},
        },
        methods: {
            async test_preview() {
                this.loading_preview = true
                var resp = await fetch('https://unbound-pricing-worker.sponsus.workers.dev/', { method: 'POST', body: JSON.stringify({ url: this.preview_url }), headers: {'Content-Type':'application/json'} }).then(resp => resp.json())
                this.loading_preview = false
                this.preview_results = resp

                this.$oruga.notification.open({
                    message: `Fetched the Worker.<br/>Time taken to respond: ${resp.time_taken} seconds<br/>Size of the response: ${this.humanize.filesize(resp.response_size)}`,
                    variant: 'primary',
                    closable: true,
                    duration: 6000,
                })

                this.seconds_per_req = resp.time_taken
                this.egress = resp.response_size

                this.show_preview_modal = false
                this.preview_url = ''

                this.share()
            },
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
                memory_used_mb = memory_used_mb * parseFloat(this.seconds_per_req)

                var gigabytes_used = (memory_used_mb / 1000) // Convert MB-s to GB-s

                gigabytes_used = Math.max(gigabytes_used - 400000, 0) // Compress to 0 if number is below 0

                this.pricing.memory_used = gigabytes_used
                this.pricing.memory = gigabytes_used * (this.rates.memory / 1000000) // Turn GB-s to an actual cost per month.

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
        },
        components: {
            VueNumeric,
        }
    }
</script>
