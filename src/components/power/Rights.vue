<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level" v-slot="scope">
          <el-tag type="success" v-if="scope.row.level==='0'" effect="dark">一级</el-tag>
          <el-tag type="warning" v-if="scope.row.level==='1'" effect="dark">二级</el-tag>
          <el-tag type="danger" v-if="scope.row.level==='2'" effect="dark">三级</el-tag>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('/rights/list');
      if(res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败!');
      }
      this.rightsList = res.data;
    }
  }
};
</script>

<style lang="less" scoped>

</style>
