<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">

        <!--则边栏-->
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu
                :shrink="shrink"
                @on-change="handleSubmenuChange"
                :theme="menuTheme"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList">
                <!--<div slot="top" class="logo-con">-->
                    <!--<Button :style="{transform: 'rotateZ(' + (this.shrink ? '0' : '0') + 'deg)'}" type="text" @click="toggleClick">-->
                        <!--<Icon v-show="!shrink" type="navicon" size="32"></Icon>-->
                    <!--</Button>-->
                    <!--&lt;!&ndash;<img v-show="!shrink"  src="../images/logo.png" key="max-logo" />&ndash;&gt;-->
                    <!--&lt;!&ndash;<img v-show="shrink" src="../images/logo-min.png" key="min-logo" />&ndash;&gt;-->
                <!--</div>-->
            </shrinkable-menu>
        </div>


        <!--顶部-->
        <div class="main-header">
            <div class="navicon-logo" >
                <img src="../images/mainlogo-nav.png" style="width: 90px;height: 31px">
            </div>

            <div class="header-middle-con">
                <div class="main-breadcrumb">
                    <span style="font-size: 19px">
                        <!--需要一个变量来判度是否为服务商还是服务商-->
                        您好！<span style="color: #19be6b"> {{ sureyName }}</span>
                    </span>
                </div>
            </div>


            <!--<div class="navicon-con">-->
                <!--<Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">-->
                    <!--<Icon type="navicon" size="32"></Icon>-->
                <!--</Button>-->
            <!--</div>-->
            <!--<div class="header-middle-con">-->
                <!--<div class="main-breadcrumb">-->
                    <!--<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>-->
                <!--</div>-->
            <!--</div>-->
            <div class="header-avator-con">
                <!--<full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>-->
                <!--<lock-screen></lock-screen>-->
                <!--<message-tip v-model="mesCount"></message-tip>-->
                <!--<theme-switch></theme-switch>-->

                <div class="user-dropdown-menu-con">
                    <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                        <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                            <a href="javascript:void(0)">
                                <span class="main-user-name">{{ userName }}</span>
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                    </Row>
                </div>
            </div>
        </div>

        <!--顶部-->
        <!--<div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}" >-->

            <!--&lt;!&ndash;标签页&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="tags-con">&ndash;&gt;-->
                <!--&lt;!&ndash;<tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--</div>-->

        <!--中间页面-->
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>
<script>
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    import lockScreen from './main-components/lockscreen/lockscreen.vue';
    import messageTip from './main-components/message-tip.vue';
    import themeSwitch from './main-components/theme-switch/theme-switch.vue';
    import Cookies from 'js-cookie';
    import util from '../libs/util.js';

    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip,
            themeSwitch
        },
        data () {
            return {
                shrink: false,
                userName: '',
                sureyName: '',
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr
            };
        },
        computed: {
            menuList () {
                return this.$store.state.app.menuList;
            },
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            },
            mesCount () {
                return this.$store.state.app.messageCount;
            }
        },
        methods: {
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                let refType = Cookies.get('refType');
                switch (refType) {
                    case '3': this.sureyName = '服务运营';
                        break;
                    case '4': this.sureyName = '服务商';
                        break;
                    case '5': this.sureyName = '渠道商';
                        break;
                    default: this.sureyName = '服务运营';
                }
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'usr_center'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    Cookies.set('cityCode', null, '/'); // 退出登录清空 城市Cookies
                    Cookies.set('userId', null);
                    Cookies.set('refType', null);
                    Cookies.set('token', null);
                    Cookies.set('agentStatus', null);
                    this.$router.push({
                        name: 'login'
                    });
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);

                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            }
        },
        mounted () {
            let webkitt = window.navigator.userAgent.toLowerCase();
            console.log(webkitt);
            let idx = webkitt.indexOf("chrome/");
            let chromeVersion = webkitt.substring(idx);
            if (chromeVersion.substring(0, 9) > 'chrome/50.0.3359.181'.substring(0, 9)) this.$util.width = "162px";//谷歌
            else this.$util.width = "143px";
            this.init();
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        }
    };
</script>
