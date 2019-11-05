<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('article:add')">新增卡类
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡类名称">
        <template slot-scope="scope">
          <span>{{scope.row.type_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="是否允许充值">
        <template slot-scope="scope">
          <span>{{scope.row.value_card==0?"允许":"不允许"}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="积分基数" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.credits_rate}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="content" label="折扣率" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.discount_rate+"%"}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="content" label="有效期" width="150">
        <template slot-scope="scope">
          <span>{{"永久"}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('article:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showUpdate(scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px;">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="memberType" label-position="left" label-width="100px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="卡类名称">
          <el-input type="text" v-model="memberType.type_name">
          </el-input>
        </el-form-item>
        <el-form-item label="允许充值">
          <el-select v-model="memberType.value_card" placeholder="允许"
                     @change="inputToDisabled(memberType.value_card)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开卡额度">
          <el-input type="text" v-model="memberType.min_amount" v-bind:disabled="disabledInput">
          </el-input>
        </el-form-item>
        <el-form-item label="允许积分">
          <el-select v-model="memberType.credits_card" placeholder="允许"
                     @change="inputToDisabled2(memberType.credits_card)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="积分基数">
          <el-input type="text" v-model="memberType.credits_rate" v-bind:disabled="disabledInput2">
          </el-input>
        </el-form-item>
        <el-form-item label="允许折扣">
          <el-select v-model="memberType.discount_card" placeholder="允许"
                     @change="inputToDisabled3(memberType.discount_card)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣率">
          <el-input type="text" v-model="memberType.discount_rate" v-bind:disabled="disabledInput3">
          </el-input>
        </el-form-item>
        <el-form-item label="允许限次">
          <el-select v-model="memberType.usetime_card" placeholder="允许"
                     @change="inputToDisabled4(memberType.usetime_card)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="限用次数">
          <el-input type="text" v-model="memberType.limit_times" v-bind:disabled="disabledInput4">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createArticle">创 建</el-button>
        <el-button type="primary" v-else @click="updateArticle">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '新增卡类'
        },
        memberType: {
          id: "",
          type_name: "",
          min_amount: "",//最低开卡额度
          discount_rate: "100",//折扣率
          credits_rate: "1",//积分基数
          limit_times: "",//限用次数
          value_card: '0',//储值卡标识
          credits_card: '0',//积分卡标识
          discount_card: '0',//折扣卡标识
          usetime_card: '0',//限次卡标识
          delete_flag: "1",
        }, options: [{
          value: '0',
          label: '允许'
        }, {
          value: '1',
          label: '不允许',
          disabled: true
        }],
        disabledInput: false,
        disabledInput2: false,
        disabledInput3: false,
        disabledInput4: false,
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.api({
          url: "/membertype/listMemberType",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
        })
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      showCreate() {
        //显示新增对话框
        this.memberType.min_amount = "0";
        this.memberType.type_name = "";
        this.memberType.discount_rate = "100";
        this.memberType.credits_rate = "1";
        this.memberType.limit_times = "1";
        this.memberType.value_card = "0";
        this.memberType.credits_card = "0";
        this.memberType.discount_card = "0";
        this.memberType.usetime_card = "0";
        this.disabledInput = false
        this.disabledInput2 = false
        this.disabledInput3 = false
        this.disabledInput4 = false
        this.dialogStatus = "create";
        this.dialogFormVisible = true

      },
      showUpdate($index) {
        //显示修改对话框
        this.memberType.id = this.list[$index].id;
        this.memberType.type_name = this.list[$index].type_name;
        this.memberType.min_amount = this.list[$index].min_amount;
        this.memberType.discount_rate = this.list[$index].discount_rate;
        this.memberType.credits_rate = this.list[$index].credits_rate;
        this.memberType.limit_times = this.list[$index].limit_times;
        this.memberType.value_card = this.list[$index].value_card + "";
        this.memberType.credits_card = this.list[$index].credits_card + "";
        this.memberType.discount_card = this.list[$index].discount_card + "";
        this.memberType.usetime_card = this.list[$index].usetime_card + "";
        this.dialogStatus = "update"
        this.inputToDisabled(this.memberType.value_card)
        this.inputToDisabled2(this.memberType.credits_card)
        this.inputToDisabled3(this.memberType.discount_card)
        this.inputToDisabled4(this.memberType.usetime_card)
        this.dialogFormVisible = true

      },
      createArticle() {
        this.api({
          url: "/membertype/addMemberType",
          method: "post",
          data: this.memberType
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateArticle() {
        //修改文章
        this.api({
          url: "/membertype/updateMemberType",
          method: "post",
          data: this.memberType
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      }, inputToDisabled(region) {
        console.log("region:" + region);
        //region:1
        //如果选择的是1那么禁用输入框,否则该输入框是可以输入的
        if (region === "1") {
          this.disabledInput = true;
          this.memberType.min_amount = "0"
        } else {
          this.disabledInput = false;
        }
      }, inputToDisabled2(region) {
        console.log("region:" + region);
        if (region === "1") {
          this.disabledInput2 = true;
          this.memberType.credits_rate = "0"
        } else {
          this.disabledInput2 = false;
        }
      }, inputToDisabled3(region) {
        if (region === "1") {
          this.disabledInput3 = true;
          this.memberType.discount_rate = "0"
        } else {
          this.disabledInput3 = false;
        }
      }, inputToDisabled4(region) {
        if (region === "1") {
          this.disabledInput4 = true;
          this.memberType.limit_times = "0"
        } else {
          this.disabledInput4 = false;
        }
      }
    }
  }

</script>
