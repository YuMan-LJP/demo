<template>
    <div>
        <h1>{{ $t("commandLog.title") }}</h1>

        <div v-for="(log, index) in logs">
            <p><span>【{{ index }}】</span>{{ log }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CommandLog',
    data() {
        return {
            logs: [],
        }
    },
    methods: {
    },
    mounted() {
        this.$common.event.on("CommandLog", (data) => {
            var logString = "";
            for (var key in data) {
                logString += key + ": " + data[key];
            }
            this.logs.push(logString);
        })
    }
}
</script>