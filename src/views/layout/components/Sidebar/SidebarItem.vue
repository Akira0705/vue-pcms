<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
      <!-- 主页 -->
      <!-- <router-link v-if="!item.hidden&&item.children&&item.children.length===1" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name"> -->
      <router-link v-if="!item.hidden&&item.children" :to="item.path+'/'+item.children[0].path" :key="item.name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" class='submenu-title-noDropdown'>
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>
      <!-- 其余选项卡 -->

      <!-- <el-submenu v-if="!item.hidden&&item.children&&item.children.length>1" :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
        </template>

        <template v-if="!child.hidden" v-for="child in item.children">
          <sidebar-item class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>

        </template>
      </el-submenu> -->

    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SidebarItem",
  props: {
    routes: {
      type: Array
    }
  },
  mounted() {
    console.log(this.routes)
  }
};
</script>
