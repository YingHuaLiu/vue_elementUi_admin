<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card class="box-card">
      <!--搜索添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态" v-slot="scope">
          <el-switch v-model="scope.row.mg_state"
                     @change="changeUserState(scope.row)"
                     active-color="#13ce66"
                     inactive-color="#dbdfe5"></el-switch>
        </el-table-column>

        <el-table-column label="操作" v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.id)"></el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>

      <!--页码-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1,5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!--添加用户对话框-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户信息对话框-->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if(regEmail.test(value)) {
        return callback();
      }
      callback(new Error('邮箱不合法!'));
    };
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3-9]\d{9}$/;
      if(regMobile.test(value)) {
        return callback();
      }
      callback(new Error('手机号不合法!'));
    };
    return {
      queryInfo: {
        // 搜索框内容
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示多少
        pagesize: 5
      },
      userList: [],
      total: 0,

      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3~10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码的长度在6~15个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 修改表单的验证规则对象
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo });
      if(res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!');
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },

    // 监听pagesize改变
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getUserList();
    },

    // 监听页码值的改变
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getUserList();
    },

    async changeUserState(userInfo) {
      const { data: res } = await this.$http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`);
      if(res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error('更新用户状态失败!');
      }
    },

    // 监听添加用户对话框关闭事件
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },

    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if(!valid) {
          return;
        }
        const { data: res } = await this.$http.post('/users', this.addUserForm);
        if(res.meta.status !== 201) {
          this.$message.error('添加用户失败!');
        }
        this.$message.success('添加用户成功!');
        this.addDialogVisible = false;
        this.getUserList();
      });
    },

    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/users/' + id);
      if(res.meta.status !== 200) {
        return this.$message.error('查询用户失败!');
      }
      this.editUserForm = res.data;
      this.editDialogVisible = true;
    },

    // 监听修改用户对话框关闭事件
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields();
    },

    // 提交修改信息
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if(!valid) {
          return;
        }
        const { data: res } = await this.$http.put('/users/' + this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        });
        console.log(res);
        if(res.meta.status !== 200) {
          return this.$message.error('修改失败!');
        }
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success('修改成功!');
      });
    },

    // 删除用户
    deleteUserById(id) {
      this.$confirm('确定删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('/users/' + id);
        if(res.meta.status !== 200) {
          return this.$message.error('删除失败!');
        }
        this.getUserList();
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>

</style>
