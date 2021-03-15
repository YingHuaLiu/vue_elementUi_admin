<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border>
        <el-table-column type="expand" v-slot="scope">
          <el-row :class="['bdBottom',index1===0?'bdTop':'','vCenter']" v-for="(item1,index1) in scope.row.children"
                  :key="item1.id">
            <!--render first level permission-->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!--render second and third permission-->
            <el-col :span="19">
              <el-row :class="[index2===0?'':'bdTop','vCenter']" v-for="(item2,index2) in item1.children"
                      :key="item2.id">
                <el-col :span="8">
                  <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                    {{ item2.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="16">
                  <el-tag type="warning" closable @close="removeRightById(scope.row,item3.id)"
                          v-for="(item3) in item2.children" :key="item3.id">
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
          </el-button>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分配权限的对话框-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" @close="defaultKeys=[]" width="50%">
      <el-tree :props="treeProps" :data="rightsList" show-checkbox ref="treeRef"
               node-key="id" default-expand-all :default-checked-keys="defaultKeys">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultKeys: [],
      roleId: ''
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles');
      if(res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!');
      }
      this.roleList = res.data;
    },

    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('this option will delete the right permanently,would you continue?', 'tips', {
        confirmButtonText: 'yes',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).catch(err => console.log(err));
      if(confirmResult === 'confirm') {
        await this.$http.delete(`/roles/${role.id}/rights/${rightId}`).then(res => {
          if(res.data.meta.status !== 200) {
            return this.$message.error('fail to delete right!');
          }
          role.children = res.data.data;
        });
      }
    },

    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get('/rights/tree');
      if(res.meta.status !== 200) {
        return this.$http.error('fail to get rights list');
      }
      this.rightsList = res.data;
      this.getLeafKeys(role, this.defaultKeys);
      this.setRightDialogVisible = true;
    },

    // By using cursive algorithm,get all rights of current role,and save them into defKeys
    getLeafKeys(node, arr) {
      if(!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(',');
      await this.$http.post(`/roles/${this.roleId}/rights`, { rids: idStr }).then(res => {
        if(res.data.meta.status !== 200) {
          return this.$message.error('fail to allot rights');
        }
        this.$message.success('allot rights successfully!');
        this.getRoleList();
        this.setRightDialogVisible = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}

.bdTop {
  border-top: 1px solid #eee;
}

.bdBottom {
  border-bottom: 1px solid #eee;
}

.vCenter {
  display: flex;
  align-items: center;
}
</style>
