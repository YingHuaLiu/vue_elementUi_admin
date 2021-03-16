<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>s商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary" @click="showAddCategoryDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
                  show-index index-text="#">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="option">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="添加分类" width="50%" @close="addCategoryDialogClosed"
               :visible.sync="addCategoryDialogVisible">
      <el-form label-width="100px"
               :rules="addCategoryFormRules"
               :model="addCategoryForm" ref="addCategoryFormRef">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--options 用来指定数据源-->
          <!--props 用来指定配置对象-->
          <el-cascader expand-trigger="hover" clearable
                       :options="parentCategoryList"
                       :props="cascaderProps"
                       v-model="selectedKeys"
                       @change="parentCategoryChanged"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      addCategoryDialogVisible: false,
      addCategoryForm: {
        // 要添加的分类名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      addCategoryFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCategoryList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的Id数组
      selectedKeys: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      this.$http.get('/categories', { params: this.queryInfo }).then(res => {
        if(res.data.meta.status !== 200) {
          return this.$message.error('获取商品分类失败!');
        }
        console.log(res);
        this.cateList = res.data.data.result;
        this.total = res.data.data.total;
      });
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 展示 添加分类 的对话框
    showAddCategoryDialog() {
      this.getParentCateList();
      this.addCategoryDialogVisible = true;
    },
    // 获取父级分类的数据列表
    getParentCateList() {
      this.$http.get('/categories', { params: { type: 2 } }).then(res => {
        if(res.data.meta.status !== 200) {
          return this.$message.error('获取父级分类数据失败');
        }
        this.parentCategoryList = res.data.data;
      });
    },
    parentCategoryChanged() {
      if(this.selectedKeys.length > 0) {
        this.addCategoryForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.addCategoryForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCategoryForm.cat_pid = 0;
        this.addCategoryForm.cat_level = 0;
      }
    },
    addCategory() {
      this.$refs.addCategoryFormRef.validate(valid => {
        if(!valid) {
          return;
        }
        this.$http.post('/categories', this.addCategoryForm).then(res => {
          if(res.data.meta.status !== 201) {
            return this.$message.error('添加分类失败');
          }
          this.$message.success('添加分类成功');
          this.getCateList();
          this.addCategoryDialogVisible = false;
        });
      });
    },
    addCategoryDialogClosed() {
      this.$refs.addCategoryFormRef.resetFields();
      this.selectedKeys = [];
      this.addCategoryForm.cat_level = 0;
      this.addCategoryForm.cat_pid = 0;
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
