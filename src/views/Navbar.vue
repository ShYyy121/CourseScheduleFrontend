<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list>
      <v-list-item v-for="(item, index) in navItems" :key="index" :to="item.route" link>
        <v-list-item-icon>
          <v-img v-if="!item.children" :src="item.icon" alt="Icon" height="24" width="24" />
          <v-icon v-else-if="!item.expanded">mdi-chevron-down</v-icon>
          <v-icon v-else>mdi-chevron-up</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-if="!item.children">{{ item.title }}</v-list-item-title>
          <v-list-item-title v-else @click="toggleExpand(item)">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
        <!-- 渲染子菜单项 -->
        <v-list v-if="item.children && item.expanded">
          <v-list-item v-for="(child, childIndex) in item.children" :key="childIndex" :to="child.route" link>
            <v-list-item-content>{{ child.title }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
<!--    <v-toolbar-title>用户信息</v-toolbar-title>-->
  </v-app-bar>
  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      drawer: false,
      navItems: [
        { title: '用户管理', icon: '../assets/account.png', route: '/Navbar/userinfo' },
        { title: '查询', icon: '../assets/magnify.png', route: '/Navbar/search' },
        {
          title: '机房管理',
          icon: '../assets/ServerRoom.png',
          expanded: false,
          children: [
            { title: '机房信息', route: '/Navbar/server-room-info' },
            { title: '排课查询', route: '/Navbar/schedule-query' }
          ]
        },
        { title: '系统设置', icon: '../assets/setting.png', route: '/Navbar/settings' },
        { title: '个人中心', icon: '../assets/person.png', route: '/Navbar/person' }
      ]
    };
  },
  methods: {
    toggleExpand(item) {
      item.expanded = !item.expanded;
    }
  }
};
</script>

<style>
/* 自定义样式 */
</style>
