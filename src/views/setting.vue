<template>
  <div class="text-center">
    <h1 style="width: 200px;">系统设置</h1>

    <h2>教学日历管理</h2>
    <v-card style="max-width: 400px; margin: 0 auto;">
      <h3>学期设置</h3>
      <v-select v-model="selectedSemester" :items="semesterOptions" label="学期" @change="fetchTeachingCalendar"></v-select>
    </v-card>

    <!-- 教学日历展示 -->
    <v-container v-if="teachingCalendar.length > 0" style="margin-top: 20px;">
      <v-row>
        <v-col v-for="month in teachingCalendar" :key="month.month">
          <h3>{{ month.month }}</h3>
          <v-card>
            <v-card-text>
              <v-data-table :headers="tableHeaders" :items="month.calendarData" hide-actions></v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 其他设置项 -->

  </div>
</template>

<script>
export default {
  name: 'Setting',
  data() {
    return {
      selectedSemester: '', // 选择的学期
      semesterOptions: ['2018春', '2018秋'], // 学期选项
      teachingCalendar: [], // 教学日历数据
      tableHeaders: ['实验室', '课程'], // 表格头部信息
      // 其他设置项的数据
    };
  },
  methods: {
    fetchTeachingCalendar() {
      // 根据选择的学期从后端获取教学日历数据
      // 更新 teachingCalendar 数组的值
    },
  },
  // 其他逻辑代码
}
</script>

<style scoped>
/* 组件样式 */
</style>
