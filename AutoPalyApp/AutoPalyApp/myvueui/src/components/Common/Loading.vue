<template>
    <div>
        <!-- 
            loading锁定页面效果组件，有三种写法：
            <BlockUI message="显示文字" url="图片地址"></BlockUI>
            <BlockUI message="显示文字" html="<i class='fa fa-cog fa-spin fa-3x fa-fw'></i>"></BlockUI>
            <BlockUI message="显示文字">
                <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
            </BlockUI> 
        -->
        <BlockUI :message="msg" v-if="isShow">
            <b-spinner label="Loading..."></b-spinner>
        </BlockUI>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        // 提示信息
        msg: {
            type: String,
            default: '正在处理中，请稍等...'
        },
        // 是否显示提示框
        isShow: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
        }
    },
    methods: {
    }
}
</script>