<template>
  <div class="schedule-management-container">
    <h1 class="text-center">排课管理</h1>

    <h2 class="text-center">选择排课类型</h2>
    <v-btn-toggle v-model="selectedScheduleType" class="text-center">
      <v-btn value="single">单次</v-btn>
      <v-btn value="batch">批量</v-btn>
    </v-btn-toggle>

    <!-- 选择实验室 -->
    <v-select label="实验室名称"  density="comfortable" v-model="selectedClassroom" :items="classrooms" ></v-select>








    <!-- 实验室课程列表 -->
    <v-card v-if="classroomCourses !== null&& isDataLoaded">
      <h2>实验室课程列表</h2>
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

    <!-- 单次排课 -->
    <v-container v-if="selectedScheduleType === 'single'">
      <v-card>
        <h2>单次排课</h2>
        <!-- 表单内容 -->
        <!-- 选择教学班 -->
        <v-select v-model="selectedTeachingClass" :items="teachingClasses" label="教学班"></v-select>

        <v-select v-model="selectedWeek" :items="teachingWeek"  label="周次" :disabled="canbeseelect === false"></v-select>

        <v-select v-model="selectedWeekDay" :items="teachingWeekend" label="日次" :disabled="canbeseelect === false"></v-select>
        <v-select v-model="selectedPeriod" :items="classPeriods"  label="课次" :disabled="canbeseelect === false"></v-select>
        <!-- 课程表展示 -->
        <h2 class="text-center">选择课程</h2>
        <v-table
          v-if="selectedTeachingClass !== ''&& ClassisDataLoaded"
          v-model="selected"
          :headers="headers"
          :items="classes"
          item-key="classId"
          :pagination.sync="pagination"
        >

          <thead>
          <tr>
            <th class="text-left">
              选择
            </th>
            <th class="text-left">
              学生人数
            </th>
            <th class="text-left">
              课程名
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
          <tr v-for="item in classes" :key="item.classId">
            <td>
              <v-checkbox v-model="selected" :value="item.classId" hide-details />
            </td>
            <td>{{ item.studentCount }}</td>
            <td>{{ item.courseName }}</td>
            <td>{{ item.labHours }}</td>
            <td>{{ item.teacherName }}</td>
          </tr>

          </tbody>
          <v-pagination v-model="pagination.number" :length="pagination.totalPages" slot="top" />
        </v-table>

      </v-card>
    </v-container>

    <!-- 批量排课 -->
    <v-container v-if="selectedScheduleType === 'batch'">
      <v-card>
        <h2>批量排课</h2>
        <!-- 表单内容 -->
        <!-- 选择教学班 -->
        <v-select v-model="selectedTeachingClass" :items="teachingClasses"  label="教学班"></v-select>
        <!-- 选择起止周数 -->
        <v-text-field v-model="startWeek" label="起始周数"></v-text-field>
        <v-text-field v-model="endWeek" label="结束周数"></v-text-field>

        <v-select v-model="selectedWeekDay" :items="teachingWeekend" label="日次"></v-select>
        <v-select v-model="selectedPeriod" :items="classPeriods"  label="课次"></v-select>
        <!-- 课程表展示 -->
        <h2 class="text-center">选择课程</h2>
        <v-table
          v-if="selectedTeachingClass !== ''||selectedTeachingClassBatch !=='' && ClassisDataLoaded"
          v-model="selected"
          :headers="headers"
          :items="classes"
          item-key="classId"
          :pagination.sync="pagination"
        >

          <thead>
          <tr>
            <th class="text-left">
              选择
            </th>
            <th class="text-left">
              学生人数
            </th>
            <th class="text-left">
              课程名
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
          <tr v-for="item in classes" :key="item.classId">
            <td>
              <v-checkbox v-model="selected" :value="item.classId" hide-details />
            </td>
            <td>{{ item.studentCount }}</td>
            <td>{{ item.courseName }}</td>
            <td>{{ item.labHours }}</td>
            <td>{{ item.teacherName }}</td>
          </tr>

          </tbody>
          <v-pagination v-model="pagination.number" :length="pagination.totalPages" slot="top" />
        </v-table>
      </v-card>
    </v-container>

    <!-- 其他内容 -->
    <div class="text-center">
      <v-btn color="primary" @click="saveSchedule">保存</v-btn>


    </div>
    <div class="text-center mt-4" >
    <v-btn color="primary"  size="x-large" @click="saveRealSchedule" >转换</v-btn>
      <v-dialog v-model="dialogVisible" max-width="500px">
        <v-card>
          <v-card-title>
            Confirm Synchronization
          </v-card-title>
          <v-card-text>
           确定转换到课程表中吗？（无法修改）
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="syncToSchedule">确定</v-btn>
            <v-btn color="error" @click="cancelSync">再考虑考虑</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {defineEmits, watch} from 'vue';
import { onMounted, reactive, ref, toRefs } from 'vue';
import "@/service/scheduleService";
import {getScheduleByClassroom} from "@/service/scheduleService";
import {useRoute} from "vue-router/dist/vue-router";

export default {
  name: 'ScheduleQuery',
  setup() {
    const route = useRoute(); // 使用 useRoute 函数获取当前路由信息
    const emits = defineEmits(['update:selectedClassroom']);

    const state = reactive({
      selected: [],
      selectedScheduleType: 'single',
      classrooms: [],
      teachingClasses: [],
      teachingWeek: Array.from({ length: 16 }, (_, index) => index + 1).map(i =>{
        return {
          title:`第${i}周`,
          value:i
        }
      }),
      canbeseelect:true,
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
      classroomCourses:null,
      classlength:0,
      selectedClassroom: '',
      selectedClassroomObj: null,
      selectedTeachingClass: '',
      selectedTeachingClassBatch: '',
      startWeek: '',
      endWeek: '',
      backendBaseUrl: '',
      tableHeaders: ['星期', '课时', '课程'],
      courseSchedule: [],
      selectedWeek: null,
      selectedWeekDay: null,
      selectedPeriod: null,
      selectedTeacher: '',
      isDataLoaded:false,
      ClassisDataLoaded:false,
      classes:[],
      pagination:[],
      dialogVisible:false
    });

    const fetchClassroomCourses = async () => {
      try {
        const response = await getScheduleByClassroom(state.selectedClassroom);
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

        state.classroomCourses = classroomCourses;
        state.isDataLoaded = true;
        console.log(state.classroomCourses);
      } catch (error) {
        console.error(error);
      }
    };
    const refreshData = async () => {
      await fetchClassrooms();
      await fetchteachingClasses();
      await fetchClassroomCourses();
      await fetchclass();
    };
    const fetchclass = async () => {
      try {
        const response = await axios.get(`${state.backendBaseUrl}/api/class?page=0&size=10&sort=className,asc`);
        const data=response.data;
        state.pagination=data.page;
        const classPromises = data._embedded.class.map(async clazz => {
          const classId = clazz._links.self.href.split('/').pop();
          const teacherresponse = await axios.get(clazz._links.teacher.href.replace('8080', '3000'));
          const courseresponse = await axios.get(clazz._links.course.href.replace('8080', '3000'));
          const teacherName= teacherresponse.data.teacherName;
          const courseName=courseresponse.data.courseName;
          const labHours=courseresponse.data.labHours;
          return {
            classId: classId,
            studentCount: clazz.studentCount,
            labHours: labHours,
            teacherName:teacherName,
            courseName:courseName
          };
        });

        const clazzss=await Promise.all(classPromises);
        state.classes=clazzss
        console.log(state.classes)
        state.ClassisDataLoaded=true

        // 在这里处理获取到的课程数据
        // console.log(classs);
      } catch (error) {
        console.error(error);
      }
    };


    const fetchClassrooms= async () => {
      try {
        const response = await axios.get(`${state.backendBaseUrl}/api/classroom`);
        state.classrooms = response.data._embedded.classroom.map(classroom => {
          const selfLink = classroom._links.self.href;
          const classroomId = selfLink.split('/').pop();
          return {
            title: classroom.classroomName,
            value: parseInt(classroomId)
          };
        });

        console.log('classrooms:', state.classrooms); // 打印 classrooms 数组
      } catch (error) {
        console.error(error);
      }
    }



    const fetchteachingClasses= async () => {
      try {
        const response = await axios.get(`${state.backendBaseUrl}/api/class`);
        state.teachingClasses = response.data._embedded.class.map(class0 => {
          const selfLink = class0._links.self.href;
          const classId = selfLink.split('/').pop();
          return{
            value:parseInt(classId),
            title:class0.className
          };
        });

        console.log('class:', state.classrooms); // 打印 classrooms 数组
      } catch (error) {
        console.error(error);
      }
    }


    const saveSchedule = () => {
      const preSchedule = {
        teachingClass: {classId : parseInt(state.selectedTeachingClass)},
        classroom: {classroomId: state.selectedClassroom},
        week: null,
        weekday: state.selectedWeekDay,
        period: state.selectedPeriod,
      };
      if (state.selectedScheduleType === 'single') {
        preSchedule.week = state.selectedWeek; // 单次排课，直接使用选定的周次
        post(preSchedule)
        if (state.canbeseelect===false){
          window.location.href = '/navbar/search';
        }
        alert("保存成功")

      } else if (state.selectedScheduleType === 'batch') {
         for(let i = state.startWeek; i<= state.endWeek; i++){
           preSchedule.week = i;
           post(preSchedule);
         } // 批量排课，使用起始周数和结束周数的格式
        if (state.canbeseelect===false){
          window.location.href = '/navbar/search';
        }
        alert("保存成功")

        //todo
      }
      // console.log("period",state.selectedPeriod)

      function post(preSchedule){
        axios.post(`${state.backendBaseUrl}/api/preschedules`,
          preSchedule)
          .then(response => {
            // if (response.code==='200'){

            // }
          })
          .catch(error => {
            console.error(error);
          });
      }

    };
    const saveRealSchedule=()=>{
      state.dialogVisible=true;
    }
    const syncToSchedule = ()=>{
      // Perform the synchronization by sending a request to the backend
      // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint for synchronization
      axios.get('/api/flush')
        .then(() => {
          // Synchronization successful
          // Add any additional logic or feedback to the user
          alert("转换成功")
        })
        .catch((error) => {
          // Handle any errors that occur during synchronization
          // Add error handling logic or feedback to the user
          alert("有时间冲突")
          console.error('Error during synchronization:', error);
        })
        .finally(() => {
          // Close the confirmation dialog
          this.dialogVisible = false;
        });
    }
    const cancelSync = () =>{
      // Close the confirmation dialog without performing the synchronization
      state.dialogVisible = false;
    }
    onMounted(async () => {
      await fetchClassrooms();
      await fetchteachingClasses();

      // const weekday = route.params.weekday;
      // const period = route.params.period;
      // const selectedWeek=route.params.selectedWeek;
      const weekday=localStorage.getItem("weekday");
      const period=localStorage.getItem("period");
      const selectedWeek=localStorage.getItem("selectedWeek");
      // 将参数值赋值给数据属性
      console.log("weekday",weekday)
      console.log("period",period)
      console.log("selectedWeek",selectedWeek)
      if (period!==null&&weekday!==null){
        state.canbeseelect=false
      }
      state.selectedWeek=selectedWeek;
      state.selectedWeekDay = weekday;
      state.selectedPeriod = period;
      // fetchClassroomCourses()
    });
    watch(
      () => state.selectedClassroom,
      async () => {
        await fetchClassroomCourses();
      }
    );

    watch(
      () => state.selectedTeachingClass,
      async () => {
        await fetchclass();
      }
    );
    watch(
      () => state.selectedScheduleType,
      async (newType, oldType) => {
        await refreshData();
      }
    );
    watch(
      () => state.selectedTeachingClassBatch,
      async () => {
        await fetchclass();
      }
    );
    return {
      ...toRefs(state),
      fetchclass,
      fetchClassroomCourses,
      saveSchedule,
      cancelSync,
      syncToSchedule,
      saveRealSchedule,
      emits
    };
  }
};
</script>

<style scoped>
.schedule-management-container {
  width: 1500px;
  margin: 0 auto;
}
</style>
