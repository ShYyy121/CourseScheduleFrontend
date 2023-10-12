<template>
  <v-app>
    <v-container>
      <h1>用户信息</h1>

      <v-row class="mt-4">
        <v-col cols="12" sm="6" md="4" class="d-flex justify-start">

        </v-col>
      </v-row>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="8">
              <h3>用户列表</h3>
            </v-col>

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
                  @click:append-inner="fetchUsers(this.search)"
                ></v-text-field>
              </v-card-text>
            </v-col>


          </v-row>

          <v-col cols="6" class="text-left">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openDialog('添加用户')">添加用户</v-btn>
          </v-col>


        </v-card-title>

        <v-card-text>
          <v-table>
            <thead>
            <tr>
              <th class="text-left">
                ID
              </th>
              <th class="text-left">
                用户名
              </th>
              <th class="text-left">
                密码
              </th>
              <th class="text-left">
                角色
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="item in mergedUsers"
              :key="item.id"
            >
              <td>{{ item.id }}</td>
              <td>{{ item.username }}</td>
              <td>{{ item.password}}</td>
              <td>{{ item.role }}</td>
              <v-icon @click="editUser(item)" class="mr-2">mdi-pencil</v-icon>
              <v-icon @click="deleteUser(item.id,item.role)">mdi-delete</v-icon>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
      <!-- Dialog for adding/editing user -->
      <v-dialog v-model="dialogVisible" max-width="500px">
        <v-card>
          <v-card-title>
            {{ dialogTitle }}
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="identity"
              :items="identityOptions"
              label="身份"
              required
            ></v-select>
            <v-text-field v-model="name" label="名字" required></v-text-field>

            <!-- Additional fields for displaying the property values -->
            <v-row v-if="identity === '管理员'">
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  label="密码"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="identity === '教师'">
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  label="密码"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="saveUser">保存</v-btn>
            <v-btn color="error" @click="closeDialog">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import Navbar from './Navbar.vue';
import axios from "axios";
export default {
  name: "UserInfoInsert",
  components: {
    Navbar, // 注册导航栏组件
  },
  data() {
    return {
      search: '',
      dialogVisible: false,
      dialogTitle: "",
      identity: "",
      name: "",
      adminName: "",
      teacherName: "",
      adminId: "",
      teacherId: "",
      backendBaseUrl: '',
      teachers:[],
      admins:[],
      loaded: false,
      loading: false,
      mergedUsers:[],
      password:'',
      identityOptions: ["管理员", "教师"],
      users: [
        { identity: "Administrator", name: "John Doe", adminName: "John", teacherName: "", adminId: 1, teacherId: null },
        { identity: "Teacher", name: "Jane Smith", adminName: "", teacherName: "Jane", adminId: null, teacherId: 2 }
      ],

      defaultUsers: [
        { identity: "Administrator", name: "John Doe", adminName: "John", teacherName: "", adminId: 1, teacherId: null },
        { identity: "Teacher", name: "Jane Smith", adminName: "", teacherName: "Jane", adminId: null, teacherId: 2 }
      ],

      headers: [
        { text: "身份", value: "identity" },
        { text: "名字", value: "name" },
        { text: "管理员名称 / 教师名称", value: "adminTeacherName" },
        { text: "管理员ID", value: "adminId" },
        { text: "教师ID", value: "teacherId" },
        { text: "操作", value: "actions" }
      ]
    };
  },
  computed: {
    filteredUsers() {
      return this.search === '' ? this.users : this.mergedUsers.filter(user =>
        user.username.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },


  mounted() {
    // 在组件加载时执行 fetchUsers 方法
    this.fetchUsers('');
  },

  methods: {
    editUser(user) {
      this.dialogTitle = "编辑";
      this.identity = user.identity;
      this.name = user.name;
      this.adminName = user.adminName;
      this.teacherName = user.teacherName;
      this.adminId = user.adminId;
      this.teacherId = user.teacherId;
      this.dialogVisible = true;
    },
    deleteUser(id,role) {
      if (role==='管理员'){
        axios.delete(`${this.backendBaseUrl}/api/administrator/${id}`)
          .then(response => {
            // 删除成功后的处理逻辑
            console.log(response); // 可选，输出响应对象
            this.fetchUsers(); // 刷新组件数据
          })
          .catch(error => {
            // 删除失败后的处理逻辑
            console.error(error); // 可选，输出错误信息
          });

      }else{
        const response= axios.delete(`${this.backendBaseUrl}/api/teacher/${id}`)
          .then(response => {
            // 删除成功后的处理逻辑
            console.log(response); // 可选，输出响应对象
            this.fetchUsers(); // 刷新组件数据
          })
          .catch(error => {
            // 删除失败后的处理逻辑
            alert("请先删除授课教师的课程")
            console.error(error); // 可选，输出错误信息
          });
      }
    },
    async fetchUsers(search) {
      this.loading = true
      let teacherResponse;
      let adminResponse;
      if (this.search === '') {
        teacherResponse = await axios.get(`${this.backendBaseUrl}/api/teacher?page=0&size=10&sort=className,asc`);
        adminResponse = await axios.get(`${this.backendBaseUrl}/api/administrator?page=0&size=10&sort=className,asc`);
        this.teachers=teacherResponse.data._embedded.teacher.map(teacher =>{
          const selfLink = teacher._links.self.href;
          const teacherId = selfLink.split('/').pop();
          return{
            id:teacherId,
            username:teacher.teacherName,
            password:teacher.teacherPassword,
            role:"教师"
          }
        });
        this.admins=adminResponse.data
          ._embedded.administrator.map(admin =>{
          const selfLink = admin._links.self.href;
          const teacherId = selfLink.split('/').pop();
          return{
            id:teacherId,
            username:admin.adminName,
            password:admin.adminPassword,
            role:"管理员"
          }
        });
      } else {
        this.teachers=[]
          this.admins=[]
        teacherResponse = await axios.get(`${this.backendBaseUrl}/api/teacher/search/findByTeacherName?teacherName=${search}`);
        adminResponse= await axios.get(`${this.backendBaseUrl}/api/administrator/search/findByAdminName?adminName=${search}`);
        const teacher = teacherResponse.data;
        const selfLink = teacher._links.self.href;
        const teacherId = selfLink.split('/').pop();

        const teacherObj = {
          id: teacherId,
          username: teacher.teacherName,
          password: teacher.teacherPassword,
          role: '教师',
        };

        this.teachers.push(teacherObj);

          const admin = adminResponse.data;
          const selfLink0 = admin._links.self.href;
          const adminId = selfLink0.split('/').pop();

          const adminObj = {
            id: adminId,
            username: admin.adminName,
            password: admin.adminPassword,
            role: '管理员',
          };

          this.admins.push(adminObj);
      }



      this.mergedUsers = [...this.teachers, ...this.admins];
      this.loading = false
      this.loaded = true
      // console.log(mergedUsers)
    },
    openDialog(title) {
      this.dialogTitle = title;
      this.identity = "";
      this.name = "";
      this.adminName = "";
      this.teacherName = "";
      this.adminId = "";
      this.teacherId = "";
      this.dialogVisible = true;
    },
    saveUser() {
      // Perform any necessary validation on the input fields
      if (this.identity === "" || this.name === "") {
        alert("请填写完整");
        return;
      }

      // Create an object with the user information based on the selected identity
      if (this.identity === '管理员') {
        let Administrator = {
          adminName: this.name,
          adminPassword: this.password,
        };
        axios.post(`${this.backendBaseUrl}/api/administrator`,Administrator).
        then(response =>{
          alert("保存成功")
        })
      }else if(this.identity === '教师'){
        let Teacher = {
          teacherName: this.name,
          teacherPassword: this.password,
        };axios.post(`${this.backendBaseUrl}/api/teacher`,Teacher).
        then(response =>{
          alert("保存成功")
        })

      }



      // Check if it's an edit or add operation
      if (this.dialogTitle === "编辑") {
        // Find the user in the array and update the values
        const index = this.users.findIndex(u => u.name === user.name);
        if (index !== -1) {
          this.users.splice(index, 1, user);
        }
      } else {
        // Add the new user to the array
        this.users.push(user);
      }

      // Reset the form fields
      this.identity = "";
      this.name = "";
      this.adminName = "";
      this.teacherName = "";
      this.adminId = "";
      this.teacherId = "";

      // Close the dialog
      this.dialogVisible = false;
    },
    closeDialog() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style>
/* Add any necessary styling for the component */
</style>

