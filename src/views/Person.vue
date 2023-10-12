<template>
  <v-container class="text-center" max-width="400">
    <v-card>
      <v-card-title>个人中心</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <h2>个人信息</h2>
            <v-avatar size="100">
              <img :src="avatarUrl" alt="头像">
            </v-avatar>
            <v-text-field v-model="firstName" label="名字"></v-text-field>
            <v-text-field v-model="lastName" label="姓氏"></v-text-field>
            <v-text-field v-model="email" label="电子邮件"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveChanges">保存</v-btn>
        <v-btn color="error" @click="cancelChanges">取消</v-btn>
        <v-btn color="primary" @click="openPasswordDialog">修改密码</v-btn>
      </v-card-actions>

      <!-- 修改密码对话框 -->
      <v-dialog v-model="passwordDialogVisible" max-width="400">
        <v-card>
          <v-card-title>
            <span class="headline">修改密码</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="closePasswordDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="currentPasswordDialog" label="当前密码" type="password"></v-text-field>
            <v-text-field v-model="newPasswordDialog" label="新密码" type="password"></v-text-field>
            <v-text-field v-model="confirmPasswordDialog" label="确认密码" type="password"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="updatePassword">确认修改</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Person',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      avatarUrl: 'https://example.com/avatar.jpg',
      passwordDialogVisible: false,
      currentPasswordDialog: '',
      newPasswordDialog: '',
      confirmPasswordDialog: ''
    };
  },
  methods: {
    saveChanges() {
      // 发送保存更改的请求到后端
      console.log('保存更改');
    },
    cancelChanges() {
      // 取消更改，重置表单数据
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    },
    openPasswordDialog() {
      // 打开修改密码对话框
      this.passwordDialogVisible = true;
    },
    closePasswordDialog() {
      // 关闭修改密码对话框
      this.passwordDialogVisible = false;
      // 重置对话框数据
      this.currentPasswordDialog = '';
      this.newPasswordDialog = '';
      this.confirmPasswordDialog = '';
    },
    updatePassword() {
      // 执行密码修改操作，发送请求到后端
      console.log('密码修改成功');
      // 关闭修改密码对话框
      this.closePasswordDialog();
    }
  }
};
</script>

<style scoped>
/* 组件样式 */
.text-center {
  margin: 0 auto;
  text-align: center;
}
</style>
