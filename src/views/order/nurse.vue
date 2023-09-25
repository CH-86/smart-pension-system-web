<template >
  <div>
    <el-button size="mini" @click="handlerCurrentChange()">添加护工 <i class="el-icon-plus"></i></el-button>    

    <el-descriptions
      class="margin-top"
      :column="5"
      border
      v-for="nurse of nursesList"
      :key="nurse.id"
    >
      <!-- <template slot="extra">
        <el-button
          type="primary"
          size="small"
          @click="handlerCurrentChange(nurse)"
          >修改</el-button
        >
      </template> -->
      <el-descriptions-item contentStyle="width: 100px">
        <template slot="label">
          <i class="el-icon-user"></i>
          姓名 </template
        >{{ nurse.name }}
      </el-descriptions-item>
      <el-descriptions-item contentStyle="width: 100px">
        <template slot="label">
          <i class="el-icon-tickets"></i>
          职称
        </template>
        <el-tag size="small">{{ nurse.position }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item contentStyle="width: 100px">
        <template slot="label">
          <i class="el-icon-tickets"></i>
          职务
        </template>
        <el-tag size="small">{{ nurse.department }}</el-tag>
        <i class="el-icon-edit-outline" @click="handlerCurrentChange(nurse)"></i>
      </el-descriptions-item>
    </el-descriptions>

    <el-dialog :title="title" :visible.sync="setnurseForm" width="300">
      <el-form ref="form" :model="nurse" label-width="70px">
        <el-form-item label="姓名">
          <el-input
            v-model="nurse.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="职务">
          <el-select v-model="nurse.department" placeholder="请选择">
            <el-option
              v-for="item in nurseDepartmentTags"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职称">
          <el-select v-model="nurse.position" placeholder="请选择">
            <el-option
              v-for="item in nursePositionTags"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="setnurse()">确 定</el-button>
          <el-button @click="setnurseForm = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
    inject:['reload'],
  data() {
    return {
      nursePositionTags:["初级","中级","高级"],
      nurseDepartmentTags:["护理","配送员"],
      setnurseForm: false,
      nurse: {},
      nursesList: [],
      title:"修改信息",
    };
  },
  methods: {
    handlerCurrentChange(value) {
      this.setnurseForm = true;
      if (value != null) {
        this.nurse = value;
        this.title="修改信息"
      }
      else {
        //this.nurse.id = null
      this.nurse = {}
      this.nurse.status = true
        this.title = "添加信息"
        //console.log("value is null")
      }
    },
    setnurse() {
      this.setnurseForm = false;
      var path = "http://localhost:8088/admin/nurse/update";
      console.log(this.nurse);
      this.$axios
        .post(
          path,
          this.nurse,
          {
            headers: { token: sessionStorage.getItem("token") },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            if (!res.data) {
              alert("非法请求" + path);
            } else {
              this.nurse = ""
              this.reload();
            }
          }
        });
    },
  },
  created() {
    var path = "http://localhost:8088/admin/allNurseTrue";
    this.$axios
      .get(path, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((res) => {
        if (res.status == 200) {
          if (!res.data) {
            console.log("sdhfskdfksj");
            alert("非法请求" + path);
          } else {
            this.nursesList = res.data;
            console.log(this.nursesList);
          }
        }
      });
  },
};
</script>