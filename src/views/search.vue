<template>
  <div class="text-center">
    <h1 style="width: 200px;">查询</h1>

    <!-- 查询类别选择 -->
    <v-card style="max-width: 400px; margin: 0 auto;">
      <h2>查询类别</h2>
      <v-btn-toggle v-model="selectedCategory" class="text-center">
        <v-btn value="teacher">按教师查询</v-btn>
        <v-btn value="teachingClass">按教学班查询</v-btn>
        <v-btn value="weeklySchedule">每周课表查询</v-btn>
      </v-btn-toggle>
    </v-card>

    <!-- 查询表单 -->
    <v-container>
      <v-form v-if="selectedCategory === 'teacher'">
        <!-- 按教师查询表单 -->
        <v-select v-model="selectedTeacher"  :update:modelValue="fetchScheduleByTeacher()"  :items="teachers" label="教师" ></v-select>

        <v-table>
          <thead>
          <tr>
            <th class="text-left">
              课程名
            </th>
            <th class="text-left">
              学生数量
            </th>
            <th class="text-left">
              实验学时
            </th>
            <th class="text-left">
              授课教师
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="item in classroomCourses"
            :key="item.classId"
          >
            <td>{{ item.courseName }}</td>
            <td>{{ item.studentCount }}</td>
            <td>{{ item.labHours}}</td>
            <td>{{ item.teacherName }}</td>
          </tr>
          </tbody>
        </v-table>

      </v-form>

      <v-form v-if="selectedCategory === 'teachingClass'">
        <!-- 按教学班查询表单 -->
        <v-select v-model="selectedTeachingClass" :update:modelValue="fetchScheduleByClass()" :items="teachingClasses"  label="教学班"></v-select>

        <!-- 实验室课程列表 -->
        <v-card v-if="classroomCourses !== [] && isDataLoaded">
          <h2>课程列表</h2>
          <!--      <v-data-table  :items="classroomCourses" :rows-per-page-items="[10, 25, 50]">-->

          <v-table>
            <thead>
            <tr>
              <th class="text-left">
                课程名
              </th>
              <th class="text-left">
                学生数量
              </th>
              <th class="text-left">
                实验学时
              </th>
              <th class="text-left">
                授课教师
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="item in classroomCourses"
              :key="item.classId"
            >
              <td>{{ item.courseName }}</td>
              <td>{{ item.studentCount }}</td>
              <td>{{ item.labHours}}</td>
              <td>{{ item.teacherName }}</td>
            </tr>
            </tbody>
          </v-table>

          <!--      </v-data-table>-->

        </v-card>

      </v-form>

      <v-form v-if="selectedCategory === 'weeklySchedule'">
        <!-- 每周课表查询表单 -->
        <v-select v-model="selectedWeek" :items="teachingWeek" :update:modelValue="fetchScheduleByWeek()" label="选择周" dense></v-select>
      </v-form>

      <v-table  v-if="selectedCategory === 'weeklySchedule' && isDataLoaded0 === true">
        <thead>
        <tr>
          <th></th>
          <th style="text-align: center;width: available;vertical-align: middle;" v-for="weekday in teachingWeekend" :key="weekday">{{ weekday.title }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, index) in timetable" :key="index">
          <th>第{{ index + 1 }}节</th>
          <td   style="text-align: center;width: available;vertical-align: middle;"
                v-for="item in row" :key="item.weekday">
            <div v-if="item.course !== null">
              {{ item.course.course.courseName }}
              <br>
              {{ item.course.course.teacherName }}
            </div>
            <div v-else >
              <v-col cols="auto">
                <v-btn color="secondary-subtitle" density="compact" icon="mdi-plus" @click="handleButtonClick(index, item.weekday)"></v-btn>
              </v-col>
            </div>
          </td>
        </tr>
        </tbody>
      </v-table>


    </v-container>

    <!-- 排课信息表格 -->
    <v-card v-if="scheduleData.length > 0">
      <h2>排课信息</h2>
      <v-data-table :headers="tableHeaders" :items="scheduleData" :rows-per-page-items="[10, 25, 50]">
        <template #item="{ item }">
          <tr>
            <td>{{ item.teacher }}</td>
            <td>{{ item.course }}</td>
            <td>{{ item.classroom }}</td>
            <!-- 其他列 -->
          </tr>
        </template>
      </v-data-table>
    </v-card>

  </div>
</template>

<script>
import axios from "axios";
import {getScheduleByClassroom, getScheduleByTeachingClass} from "@/service/scheduleService";
import "@/service/scheduleService";
export default {
  name: 'Search',
  data() {
    return {
      selectedCategory: null, // 选择的查询类别
      teachers: [ // 教师列表
      ],
      selectedTeacher: '', // 选择的教师
      selectedTeachingClass: '', // 选择的教学班
      selectedWeek: null, // 选择的周
      scheduleData: [], // 排课信息数据
      teachingClasses:[],
      backendBaseUrl:'',
      tableHeaders: ['教师', '课程', '实验室'], // 排课信息表头部信息
      classroomCourses:[],
      isDataLoaded:false,
      schedules:[],
      mouseOverTable: false, // 鼠标是否在课程表上
      showButton: false, // 是否显示按钮
      teachingWeekend: [
        { value: 1, title: '周一' },
        { value: 2, title: '周二' },
        { value: 3, title: '周三' },
        { value: 4, title: '周四' },
        { value: 5, title: '周五' },
        { value: 6, title: '周六' },
        { value: 7, title: '周日' }
      ],
      classPeriods: [
        { value: 1, title: '第一节' },
        { value: 2, title: '第二节' },
        { value: 3, title: '第三节' },
        { value: 4, title: '第四节' },
        { value: 5, title: '第五节' },
        { value: 6, title: '第六节' },
        { value: 7, title: '第七节' },
        { value: 8, title: '第八节' },
        { value: 9, title: '第九节' },
        { value: 10, title: '第十节' }
      ],

      isDataLoaded0:false,
      timetable : [],
      teachingWeek: Array.from({ length: 16 }, (_, index) => index + 1).map(i =>{
        return {
          title:`第${i}周`,
          value: i
        }
      }),
    };
  },
  watch: {
    selectedCategory() {
      // 清空选择的查询条件
      this.selectedTeacher = '';
      this.selectedTeachingClass = '';
      // this.selectedWeek = null;
    },
  },
  mounted() {
    this.fetchteachingClasses();
    this.fetchteacher();
    this.initTimetable();
    const selectedWeek=localStorage.getItem("selectedWeek");
    if (selectedWeek !== null){
      this.selectedCategory = 'weeklySchedule';
      this.selectedWeek=selectedWeek;
    }
    localStorage.clear();
  },
  methods: {
    fetchScheduleData() {
      // 根据选定的查询类别和其他查询条件发送请求给后端进行查询
      if (this.selectedCategory === 'teacher') {
        // 按教师查询
        console.log('按教师查询，教师ID:', this.selectedTeacher);
        // 发送请求给后端进行查询，处理后端返回的数据
        this.scheduleData = [
          { teacher: '教师A', course: '课程A', classroom: '实验室A' },
          { teacher: '教师B', course: '课程B', classroom: '实验室B' },
          // 其他排课信息...
        ];
      } else if (this.selectedCategory === 'teachingClass') {
        // 按教学班查询
        console.log('按教学班查询，教学班ID:', this.selectedTeachingClass);
        // 发送请求给后端进行查询，处理后端返回的数据
        this.scheduleData = [
          { teacher: '教师C', course: '课程C', classroom: '实验室C' },
          { teacher: '教师D', course: '课程D', classroom: '实验室D' },
          // 其他排课信息...
        ];
      } else if (this.selectedCategory === 'weeklySchedule') {
        // 每周课表查询
        console.log('每周课表查询，选择的周:', this.selectedWeek);
        // 发送请求给后端进行查询，处理后端返回的数据
        this.scheduleData = [
          { teacher: '教师E', course: '课程E', classroom: '实验室E' },
          { teacher: '教师F', course: '课程F', classroom: '实验室F' },
          // 其他排课信息...
        ];
      }
    },
    async fetchScheduleByWeek() {
      const response = await axios.get(`/api/schedule/search/findScheduleByWeek?week=${this.selectedWeek}`);
      const classroomPromises=response.data._embedded.schedule.map(async schedule => {
        const selfLink = schedule._links.self.href;
        const scheduleId = selfLink.split('/').pop();
        const classresponse = await axios.get(schedule._links.teachingClass.href.replace('8080', '3000'));
        const courseNameresponse = await axios.get(classresponse.data._links.course.href.replace('8080', '3000'));
        const teacherresponse = await axios.get(classresponse.data._links.teacher.href.replace('8080', '3000'));
        const courseName = courseNameresponse.data.courseName;
        const labHours = courseNameresponse.data.labHours;
        const teacherName = teacherresponse.data.teacherName;
        const studentCount=classresponse.data.studentCount;
        return {
          id: scheduleId,
          weekday: schedule.weekday,
          period: schedule.period,
          course:{
            courseName:courseName,
            teacherName:teacherName
          }
        };
      })
      const classroomCourses = await Promise.all(classroomPromises);

      this.schedules = classroomCourses;
      // 清空课程表
      this.timetable = [];

      for (let i = 0; i < this.classPeriods.length; i++) {
        const row = [];
        for (let j = 0; j < this.teachingWeekend.length; j++) {
          const weekday = this.teachingWeekend[j].value.toString();
          const period = this.classPeriods[i].value.toString();
          const course = this.schedules.find(c => c.weekday === weekday && c.period === period);
          row.push({
            period: period,
            weekday: weekday,
            course: course ? course : null
          });
        }
        this.timetable.push(row);
      }
      console.log(this.timetable)
      this.isDataLoaded0 = true;
    },
    initTimetable(){
      // 创建课程表的数据结构
      for (let i = 0; i < this.classPeriods.length; i++) {
        const row = [];
        for (let j = 0; j < this.teachingWeekend.length; j++) {
          row.push({
            period: this.classPeriods[i],
            weekday: this.teachingWeekend[j],
            course: null
          });
        }
        this.timetable.push(row);
      }
    },
    async fetchteachingClasses() {
      try {
        const response = await axios.get(`${this.backendBaseUrl}/api/class`);
        this.teachingClasses = response.data._embedded.class.map(class0 =>{
          const selfLink = class0._links.self.href;
          const classId = selfLink.split('/').pop();
          return{
           title:class0.className,
            value:classId
          };
        } );
        // console.log(this.teachingClasses)

      } catch (error) {
        console.error(error);
      }
    },
    async fetchteacher() {
      try {
        const response = await axios.get(`${this.backendBaseUrl}/api/teacher`);
        this.teachers = response.data._embedded.teacher.map(teacher =>{
        const selfLink = teacher._links.self.href;
        const teacherId = selfLink.split('/').pop();
          return{
          value:teacherId,
          title:teacher.teacherName
          };
          this.fetchScheduleByTeacher();
      }
          );
      } catch (error) {
        console.error(error);
      }
    },
    async fetchScheduleByTeacher(){
      const response = await axios.get(`/api/schedule/search/findByTeacher?id=${this.selectedTeacher}`);
      const classroomPromises=response.data._embedded.schedule.map(async item => {
        const selfLink = item._links.self.href;
        const courseId = selfLink.split('/').pop();
        const classresponse = await axios.get(item._links.teachingClass.href.replace('8080', '3000'));
        const courseNameresponse = await axios.get(classresponse.data._links.course.href.replace('8080', '3000'));
        const teacherresponse = await axios.get(classresponse.data._links.teacher.href.replace('8080', '3000'));
        const courseName = courseNameresponse.data.courseName;
        const labHours = courseNameresponse.data.labHours;
        const teacherName = teacherresponse.data.teacherName;
        const studentCount=classresponse.data.studentCount;
        return {
          classId: courseId,
          courseName: courseName,
          studentCount: studentCount,
          labHours: labHours,
          teacherName: teacherName,
        };
      });

      const classroomCourses = await Promise.all(classroomPromises);

      this.classroomCourses = classroomCourses;
     this.isDataLoaded = true;

    },
    async fetchScheduleByClass(){
      const response = await getScheduleByClassroom(this.selectedTeachingClass);
      const classroomPromises = response._embedded.schedule.map(async item => {
        const selfLink = item._links.self.href;
        const courseId = selfLink.split('/').pop();
        const classresponse = await axios.get(item._links.teachingClass.href.replace('8080', '3000'));
        const courseNameresponse = await axios.get(classresponse.data._links.course.href.replace('8080', '3000'));
        const teacherresponse = await axios.get(classresponse.data._links.teacher.href.replace('8080', '3000'));
        const courseName = courseNameresponse.data.courseName;
        const labHours = courseNameresponse.data.labHours;
        const teacherName = teacherresponse.data.teacherName;
        const studentCount=classresponse.data.studentCount;
        return {
          classId: courseId,
          courseName: courseName,
          studentCount: studentCount,
          labHours: labHours,
          teacherName: teacherName,
        };
      });


      const classroomCourses = await Promise.all(classroomPromises);

      this.classroomCourses = classroomCourses;
      this.isDataLoaded = true;
      console.log(this.classroomCourses);
    },
    handleButtonClick(rowIndex, columnKey) {
      // 在这里处理按钮点击事件
      // rowIndex//课次
      // columnKey//星期数
      console.log(this.selectedWeek)
      localStorage.setItem("weekday",columnKey);
      localStorage.setItem("period",rowIndex);
      localStorage.setItem("selectedWeek",this.selectedWeek);
      console.log('按钮点击位置坐标:', rowIndex, columnKey);

      // 进行页面跳转，并传递参数
      this.$router.push({
        name: 'ScheduleQuery',
        params: {
          weekday: columnKey,
          period: rowIndex,
          selectedWeek:this.selectedWeek
        }
      });
    }

  },

};
</script>

<style scoped>
/* 组件样式 */
.td th{
  align-self: center;
  text-align: center;
  vertical-align: middle;
}
</style>
