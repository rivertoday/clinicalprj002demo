<template>
  <el-row class="container">
    <!-- 头部栏 -->
    <el-col :span="24" class="header">
      <el-col
        :span="10"
        class="logo"
        :class="collapsed?'logo-collapse-width':'logo-width'"
      >{{collapsed?'':sysName}}</el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="8" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <img src="@/assets/user.png" />
            {{sysUserName}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <!-- 这里的native不能删,native用来触发原生的事件,可以理解为把一个vue组件转化为一个普通的HTML标签 -->
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <!-- 侧边栏 -->
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-未折叠-->
        <!-- 这里可以用this.$route.path -->
        <!--router参数:是否使用 vue-router 的模式,启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleopen"
          @close="handleclose"
          @select="handleselect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
          v-show="!collapsed"
        >
          <template v-for="(item,index) in routes">
            <!--if 有次级菜单, leaf是判断的flag -->
            <el-submenu :index="index+''" :key="item.name" v-if="item.leaf">
              <!-- slot插槽，必须有slot -->
              <template slot="title">
                <i :class="item.iconCls"></i>
                {{item.name}}
              </template>
              <el-menu-item
                v-for="child in routeChildren(item)"
                :index="child.path"
                :key="child.path"
              >{{child.name}}</el-menu-item>
            </el-submenu>
            <!--else 普通的没有次级的菜单项 -->
            <el-menu-item
              v-if="!item.leaf&&item.children.length>0"
              :key="item.name"
              :index="item.children[0].path"
            >
              <i :class="item.iconCls"></i>
              {{item.children[0].name}}
            </el-menu-item>
          </template>
        </el-menu>
        <!-- 导航菜单-折叠 -->
        <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
          <li v-for="(item,index) in routes" :key="item.name" class="el-submenu item">
            <!--多级菜单route渲染-->
            <template v-if="!item.leaf">
              <!--经过菜单显示对应ul的事件-->
              <div
                class="el-submenu__title"
                style="padding-left: 20px;"
                @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)"
              >
                <i :class="item.iconCls"></i>
              </div>
              <ul
                class="el-menu submenu"
                :class="'submenu-hook-'+index"
                @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)"
              >
                <li
                  v-for="child in item.children"
                  :key="child.path"
                  class="el-menu-item"
                  style="padding-left: 40px;"
                  :class="$route.path===child.path?'is-active':''"
                  @click="$router.push(child.path)"
                >{{child.name}}</li>
              </ul>
            </template>
            <!-- 单级菜单 -->
            <template v-else>
              <li class="el-submenu">
                <div
                  class="el-submenu__title el-menu-item"
                  style="height: 56px;line-height: 56px;padding: 0 20px;"
                  :class="$route.path===item.children[0].path?'is-active':''"
                  @click="$router.push(item.children[0].path)"
                >
                  <i :class="item.iconCls"></i>
                </div>
              </li>
            </template>
          </li>
        </ul>
      </aside>
      <!-- 显示内容 -->
      <section class="content-container">
          <!-- 面包屑breadcrumb -->
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <!-- 内容 -->
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
      </section>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name:'Home',
  data() {
    return {
      sysName: "中医流调数据平台",
      collapsed: false,
      sysUserName: "",
      sysUserAvatar: "",
    };
  },
  computed: {
    // 关于v-for v-if，data里未定义的变量遍历使用计算属性。否则使用v-for v-if配合使用
    routes: function() {
      return this.$router.options.routes.filter(function(item) {
        return !item.hidden;
      });
    },
    // 利用闭包实现计算属性传参。 从当前route中取出符合条件的子路由
    routeChildren: function(route) {
      return function(route) {
        return route.children.filter(function(child) {
          return !child.hidden;
        });
      };
    }
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleopen() {
      // console.log('handleopen');
    },
    handleclose() {
      // console.log('handleclose');
    },
    handleselect: function(a, b) {},
    // 退出登录
    logout: function() {
      var _this = this; //这条语句是防止this指向当前函数,这样赋值_this就指向vm对象了
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          sessionStorage.removeItem("user");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    // 折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    }
  },
  mounted() {
    // console.log('this->',this)
    // console.log('this.$el->',this.$el)
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      console.log(user);
      this.sysUserName = user.username || "";
      this.sysUserAvatar = user.avatar || "";
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/vars";

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;

  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;

    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;

      .userinfo-inner {
        cursor: pointer;
        color: #fff;

        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }

    .logo {
      height: 60px;
      font-size: 19px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;

      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }

      .txt {
        color: #fff;
      }
    }

    .logo-width {
      width: 230px;
    }

    .logo-collapse-width {
      width: 60px;
    }

    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }

  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;

    aside {
      flex: 0 0 230px;
      width: 230px;
      .el-menu {
        height: 100%;
      }

      .collapsed {
        width: 60px;

        .item {
          position: relative;
        }

        .submenu {
          position: absolute;
          top: 0;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }

    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }

    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;

      .el-menu {
        /*打补丁的方式解决左侧菜单宽度显示不全*/
        width: 100% !important;
      }

      .el-submenu .el-menu-item {
        min-width: 0px !important;
      }
    }

    .content-container {
      flex: 1;
      overflow-y: scroll;
      padding: 20px;

      .breadcrumb-container {
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }

        .breadcrumb-inner {
          float: right;
        }
      }

      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>
