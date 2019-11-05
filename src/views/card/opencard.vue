<template>
  <div class="app-container">
    <span style="color:black;font-family: Arial">基本信息 </span><span
    style="color:red;font-family: Arial"> 带（*）号的为必填项 </span>
    <div class="app-container">
      <el-form class="small-space" :model="member" label-position="left" label-width="100px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="会员编号">
          <el-input type="text" v-model="member.vip_no">
          </el-input>
        </el-form-item>

        <el-form-item label="会员卡号">
          <el-input type="text" v-model="member.card_no">
          </el-input>
        </el-form-item>

        <el-form-item label="会员姓名" required=“true”>
          <el-input type="text" v-model="member.name">
          </el-input>
        </el-form-item>

        <el-form-item label="手机号码" required=“true”>
          <el-input type="text" v-model="member.mobile">
          </el-input>
        </el-form-item>
        <el-form-item label="会员生日" required=“true”>
          <el-date-picker
            v-model="member.birthday"
            type="date"
            placeholder="请选择您的生日日期"
            style='width: 300px'>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="会员性别">
          <template>
            <el-radio v-model="member.sex" label="1">男</el-radio>
            <el-radio v-model="member.sex" label="2">女</el-radio>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <span style="color:black;font-family: Arial">卡片信息</span>
    <div class="app-container">
      <el-form class="small-space" :model="memberType" label-position="left" label-width="100px"
               style='width: 400px; margin-left:50px;'>

        <el-form-item label="卡片类型" required=“true”>
          <el-select v-model="memberType.type_name" placeholder="请选择一种卡类"
                     @change="inputToDisabled(memberType.type_name)" filterable style="display:block;">
            <el-option
              v-for="item in list"
              :key="item.type_name"
              :label="item.label"
              :value="item.type_name">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="折扣分类">
          <el-input type="text" v-model="memberTypeStr.discount_card" disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="折扣比率">
          <el-input type="text" v-model="memberTypeStr.discount_rate" disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="能否积分">
          <el-input type="text" v-model="memberTypeStr.credits_card" disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="积分基数">
          <el-input type="text" v-model="memberTypeStr.credits_rate" disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="是否限次">
          <el-input type="text" v-model="memberTypeStr.usetime_card" disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="限用次数">
          <el-input type="text" v-model="memberTypeStr.limit_times" disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="能否充值">
          <el-input type="text" v-model="memberTypeStr.value_card" disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="开卡额度">
          <el-input type="text" v-model="memberTypeStr.min_amount" disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="预存金额" required=“true”>
          <el-input type="text" v-model="member.card_no">
          </el-input>
        </el-form-item>
        <el-form-item label="赠送金额">
          <el-input type="text" v-model="member.card_no">
          </el-input>
        </el-form-item>
        <el-form-item label="预送积分" required=“true”>
          <el-input type="text" v-model="member.card_no">
          </el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input type="text" v-model="member.card_no">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style='width: 300px' icon="plus" @click="showCreate"
                     v-if="hasPerm('article:add')">保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: [],//表格的数据
        member: {
          vip_no: "",
          card_no: "",
          name: "",
          sex: "1",
          mobile: "",
          birthday: "",
        },
        memberType: {
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
        }, memberTypeStr: {
          min_amount: "--",//最低开卡额度
          discount_rate: "--",//折扣率
          credits_rate: "--",//积分基数
          limit_times: "--",//限用次数
          value_card: '--',//储值卡标识
          credits_card: '--',//积分卡标识
          discount_card: '--',//折扣卡标识
          usetime_card: '--',//限次卡标识
        }
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
      createArticle() {
        //保存新文章
        this.api({
          url: "/article/addArticle",
          method: "post",
          data: this.tempArticle
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      }, inputToDisabled(region) {
        var type
        for (var i = 0; i < this.list.length; i++) {
          if (region == this.list[i].type_name) {
            type = this.list[i]
            break
          }
        }
        this.memberTypeStr.min_amount=type.min_amount
        this.memberTypeStr.discount_rate=type.discount_rate
        this.memberTypeStr.credits_rate=type.credits_rate
        this. memberTypeStr.limit_times=type.limit_times
        this. memberTypeStr.value_card=type.value_card==0?"能":"不能"
        this. memberTypeStr.credits_card=type.credits_card==0?"能":"不能"
        this. memberTypeStr.discount_card=type.discount_card==0?"固定折扣":"不能折扣"
        this.memberTypeStr.usetime_card=type.usetime_card==0?"是":"不是"

      },
    }
  }
</script>
