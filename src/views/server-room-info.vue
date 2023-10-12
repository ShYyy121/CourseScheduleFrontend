<template>
  <v-container>
    <h1>机房信息</h1>

    <v-row class="mt-4">
      <v-col cols="6" class="text-left">
        <v-card-text>
          <v-text-field
            :loading="loading"
            density="compact"
            variant="solo"
            label="输入用户名"
            append-inner-icon="mdi-magnify"
            v-model="this.search"
            single-line
            hide-details
            @click:append-inner="fetchRooms(this.search)"
          ></v-text-field>
        </v-card-text>
      </v-col>
      <v-col cols="12" sm="6" md="4" class="text-right">
        <v-btn color="primary" @click="openDialog('添加机房')">添加机房</v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-row>
          <v-col v-for="header in headers" :key="header.value" cols="auto">
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-table>
          <thead>
          <tr>
            <th class="text-left">
              机房名称
            </th>
            <th class="text-left">
              设备类型
            </th>
            <th class="text-left">
              设备数量
            </th>
            <th class="text-left">
              容量
            </th>
            <th class="text-left">
             操作
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="item in classrooms"
            :key="item.classroomId"
          >
            <td>{{ item.classroomName }}</td>
            <td>{{ item.equipmentType }}</td>
            <td>{{ item.equipmentCount}}</td>
            <td>{{ item.capacity }}</td>
            <td> <v-icon @click="editClassroom(item)" class="mr-2">mdi-pencil</v-icon>
              <v-icon @click="deleteClassroom(item)">mdi-delete</v-icon></td>


          </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Dialog for adding/editing classroom -->
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title>
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="classroomName" label="机房名称" required></v-text-field>
          <v-text-field v-model="equipmentType" label="设备类型" required></v-text-field>
          <v-text-field v-model="equipmentCount" label="设备数量" required></v-text-field>
          <v-text-field v-model="capacity" label="容量" required></v-text-field>
        <v-btn color="primary" @click="saveClassroom">保存</v-btn>
        <v-btn color="error" @click="closeDialog">取消</v-btn>
        </v-card-text>
        <v-card-actions>

        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Navbar from './Navbar.vue';
import axios from "axios";

export default {
  name: 'ServerRoomInfo',
  components: {
    Navbar
  },
  data() {
    return {
      search: '',
      dialogVisible: false,
      dialogTitle: '',
      headers: [
        { text: 'ID', value: 'classroomId' },
        { text: '机房名称', value: 'classroomName' },
        { text: '设备类型', value: 'equipmentType' },
        { text: '设备数量', value: 'equipmentCount' },
        { text: '容量', value: 'capacity' }
      ],
      classrooms: [
      ],
      classroomName: '',
      equipmentType: '',
      equipmentCount: 0,
      capacity: 0,
      sortBy: 'classroomId',
      sortDesc: false,
      backendBaseUrl:'',
      loaded: false,
      loading: false,
    };
  },
  computed: {
    filteredClassrooms() {
      return this.search === '' ? this.classrooms : this.classrooms.filter(classroom =>
        classroom.classroomName.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  mounted() {
    this.fetchteachingClasses();
    // this.filteredClassrooms();
  },
  methods: {
    editClassroom(classroom) {
      this.dialogTitle = '编辑';
      this.classroomName = classroom.classroomName;
      this.equipmentType = classroom.equipmentType;
      this.equipmentCount = classroom.equipmentCount;
      this.capacity = classroom.capacity;
      this.dialogVisible = true;
    },
    deleteClassroom(classroom) {
      const index = this.classrooms.indexOf(classroom);
      if (index !== -1) {
        this.classrooms.splice(index, 1);
      }
    },
    openDialog(title) {
      this.dialogTitle = title;
      this.classroomName = '';
      this.equipmentType = '';
      this.equipmentCount = '';
      this.capacity = '';
      this.dialogVisible = true;
    },
    saveClassroom() {
      const classroom0 = {
        classroomName: this.classroomName,
        equipmentType: this.equipmentType,
        equipmentCount: this.equipmentCount,
        capacity: this.capacity
      };
      axios.post(`${this.backendBaseUrl}/api/classroom`, classroom0)
        .then(response => {
          alert("保存成功")
        })
      this.classrooms.push(classroom);
      this.dialogVisible = false;
    },
    async fetchRooms(search) {
      this.loading = true
      let teacherResponse;
      let adminResponse;
      if (this.search === '') {
        teacherResponse = await axios.get(`${this.backendBaseUrl}/api/classroom?page=0&size=10&sort=className,asc`);
        this.classrooms = teacherResponse.data._embedded.classroom.map(classroom => {
          const selfLink = classroom._links.self.href;
          const roomId = selfLink.split('/').pop();
          return {
            classroomId: roomId,
            classroomName: classroom.classroomName,
            equipmentType: classroom.equipmentType,
            equipmentCount: classroom.equipmentCount,
            capacity: classroom.capacity
          }
        });
      } else {
        this.classrooms = []
        const roomResponse = await axios.get(`${this.backendBaseUrl}/api/classroom/search/findByClassroomName?name=${search}`);
        this.classrooms = roomResponse.data._embedded.classroom.map(classroom => {
          const selfLink = classroom._links.self.href;
          const roomId = selfLink.split('/').pop();
          return {
            classroomId: roomId,
            classroomName: classroom.classroomName,
            equipmentType: classroom.equipmentType,
            equipmentCount: classroom.equipmentCount,
            capacity: classroom.capacity
          };
        });


        // this.classrooms.push(classroom);

      }

      console.log(this.classrooms)

      // this.mergedUsers = [...this.classrooms];
      this.loading = false
      this.loaded = true
    },
    async fetchteachingClasses() {
      try {
        const response = await axios.get(`${this.backendBaseUrl}/api/classroom`);
        this.classrooms = response.data._embedded.classroom.map(classroom => {
            const selfLink = classroom._links.self.href;
            const classroomId = selfLink.split('/').pop();
            return {
              classroomId: classroomId,
              classroomName: classroom.classroomName,
              equipmentType: classroom.equipmentType,
              equipmentCount: classroom.equipmentCount,
              capacity: classroom.capacity
            };
          }
        );
        // console.log('classrooms:', state.classrooms); // 打印 classrooms 数组
      } catch (error) {
        console.error(error);
      }
    },


    closeDialog() {
      this.dialogVisible = false;
    }
  }
};

</script>

<style scoped>
/* 自定义样式 */
</style>
