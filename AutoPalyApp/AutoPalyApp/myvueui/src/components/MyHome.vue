<template>
    <div>
        <h2>我是Home的内容</h2>
        <p>UserName: {{ $route.params.username }}</p>
    </div>
</template>

<script>
    export default {
        name:'Home',
    }
</script>