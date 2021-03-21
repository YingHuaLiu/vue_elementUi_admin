<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>

      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader expand-trigger="hover" :options="cateList" :props="cateProps" v-model="selectedCateKeys"
                       @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数
          </el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand" v-slot="scope">
              <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable
                      @close="handleClose(index,scope.row)">{{ item }}
              </el-tag>
              <el-input class="input-new-tag" ref="saveTagInput" size="small"
                        v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性
          </el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand" v-slot="scope">
              <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable
                      @close="handleClose(index,scope.row)">{{ item }}
              </el-tag>
              <el-input class="input-new-tag" ref="saveTagInput" size="small"
                        v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数的对话框-->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" @close="addDialogClosed" width="50%">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      // 被激活的页签名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      addDialogVisible: false,

      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      this.$http.get('/categories').then(res => {
        if(res.data.meta.status !== 200) {
          return this.$message.error('获取商品分类失败！');
        }
        this.cateList = res.data.data;
      });
    },
    handleChange() {
      this.getParamsData();
    },
    handleTabClick() {
      this.getParamsData();
    },
    getParamsData() {
      if(this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      this.$http.get(`/categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      }).then(res => {
        if(res.data.meta.status !== 200) {
          return this.$message.error('获取参数列表失败！');
        }
        console.log(res);
        res.data.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
          item.inputVisible = false;
          item.inputValue = '';
        });
        if(this.activeName === 'many') {
          this.manyTableData = res.data.data;
        } else {
          this.onlyTableData = res.data.data;
        }
      });
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate(valid => {
        if(!valid) {
          return;
        }
        this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }).then(res => {
          if(res.data.meta.status !== 201) {
            return this.$message.error('添加参数失败');
          }
          this.$message.success('添加参数失败');
          this.addDialogVisible = false;
          this.getParamsData();
        });
      });
    },
    // 文本框失去焦点或者按下enter都会触发
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputVisible = false;
      row.intputValue = '';
      this.$http.put(`/categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }).then(res => {
        if(res.data.meta.status !== 200) {
          return this.$message.error('修改参数项失败！');
        }
        this.$message.success('修改成功!');
      });
    },
    handleClose(index, row) {
      console.log(row);
      row.attr_vals.splice(index, 1);
      this.$http.put(`/categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }).then(res => {
        if(res.data.meta.status !== 200) {
          return this.$message.error('修改参数项失败！');
        }
        this.$message.success('修改成功!');
      });
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  },
  computed: {
    isBtnDisabled() {
      if(this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类id
    cateId() {
      if(this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    titleText() {
      if(this.activeName === 'many') {
        return '动态参数';
      }
      return '静态属性';
    }
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 0 8px;
}

.input-new-tag {
  width: 120px;
}
</style>
