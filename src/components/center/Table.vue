<template>
  <div class="table">
      <!--用户会员以及购买-->
      <Card>
          <div class="table-title">
              报表中心
          </div>
          <div>
              <Form :model="formItem" ref="formItem" :rules="ruleValidate"  :label-width="80" target="_blank">
                  <FormItem label="时间">
                      <Row>
                          <Col span="5">
                              <DatePicker type="date" placeholder="开始时间" v-model="formItem.startDate" :value="startDate" @on-change="getStartDate" format="yyyy-MM-dd"></DatePicker>
                          </Col>
                          <Col span="2" style="text-align: center">-</Col>
                          <Col span="5">
                              <DatePicker type="date" placeholder="结束时间" v-model="formItem.endDate" :value="endDate" @on-change="getEndDate" format="yyyy-MM-dd"></DatePicker>
                          </Col>
                      </Row>
                  </FormItem>
                  <FormItem label="订单类型" prop="type">
                      <Select v-model="formItem.type">
                          <Option value="100">全部</Option>
                          <Option value="0">免票订单</Option>
                          <Option value="1">降舱订单</Option>
                      </Select>
                  </FormItem>

                  <FormItem label="订单状态" prop="status">
                      <Select v-model="formItem.status" >
                          <Option value="100">全部</Option>
                          <Option value="0">监控中</Option>
                          <Option value="200">监控成功</Option>
                          <Option value="400">监控失败</Option>
                          <Option value="2">取消监控</Option>
                      </Select>
                  </FormItem>

                  <FormItem label="处理状态" v-if="formItem.status == '200'">
                      <Select v-model="formItem.successType">
                          <Option value="100">全部</Option>
                          <Option value="1">已处理</Option>
                          <Option value="0">未处理</Option>
                      </Select>
                  </FormItem>


                  <FormItem>
                      <Button type="primary" @click="handleSubmit('formItem')">提交</Button>
                      <Button style="margin-left: 8px" @click="handleResect('formItem')">取消</Button>
                  </FormItem>
              </Form>
          </div>

      </Card>

  </div>
</template>

<script>
    export default {
        name: "Table",
        data(){
            return {
                startDate: '',
                endDate: '',
                formItem: {
                    startDate: '',//开始时间
                    endDate: '',//结束时间
                    type: '',//订单类型  100全部，free免票，seat降舱
                    status: '',//订单状态  100全部 300监控中 200监控成功 400监控失败
                    successType: '',//订单成功状态， 100全部，0未处理，1已处理
                },
                ruleValidate: {
                    type: [
                        { required: true, message: '请选择订单类型', trigger: 'change' }
                    ],
                    status: [
                        { required: true, message: '请选择订单状态', trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            // 重新选择
            handleResect (name) {
                this.$refs[name].resetFields();
            },
            //提交表单
            handleSubmit(name){
                var that = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var startDate = that.startDate;
                        var endDate = that.endDate;
                        var type = this.$refs[name].model.type;
                        var status = this.$refs[name].model.status;
                        var successType = this.$refs[name].model.successType;
                        var data = {};
                        console.log(startDate,endDate,type,status);
                        if(status == '100'){//监控状态全部订单
                            data = {
                                beginTime: startDate,
                                endTime: endDate,
                                type: type=='100'?'':type,
                                status: '',
                            }
                        }
                        else if(status == '200'){ //监控成功
                          if(successType == ''||successType == '100'){//监控成功底下所有订单
                              data = {
                                  beginTime: startDate,
                                  endTime: endDate,
                                  type: type=='100'?'':type,
                                  status: 1,
                                  success: 4
                              }
                          }
                          else if(successType == '0'){//监控成功底下 未处理订单
                              data = {
                                  beginTime: startDate,
                                  endTime: endDate,
                                  type: type=='100'?'':type,
                                  status: 1,
                                  success: 4,
                                  isSolution: false,
                              }
                          }
                          else if(successType == '1'){//监控成功底下 已处理订单
                              data = {
                                  beginTime: startDate,
                                  endTime: endDate,
                                  type: type=='100'?'':type,
                                  status: 1,
                                  success: 4,
                                  isSolution: true,
                              }
                          }

                        }
                        else if(status == '400'){ //监控失败
                            data = {
                                beginTime: startDate,
                                endTime: endDate,
                                type: type=='100'?'':type,
                                status: 1,
                                success: 3
                            }
                        }
                        else if(status == "0"||status == '2'){//监控中，取消监控
                            data = {
                                beginTime: startDate,
                                endTime: endDate,
                                type: type=='100'?'':type,
                                status: status,
                            }
                        }

                        console.log(data);

                        this.$http({
                            url:this.$comjs.IP+'/monitor/exportExcel',
                            method: 'post',
                            data: data,
                            responseType:'blob',
                            // headers: {
                            //     'Content-Type': 'application/json;charset=UTF-8'    //后端ssm框架接收json类型
                            // }
                        }) .then(res => {
                            var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
                            var downloadElement = document.createElement('a');
                            var href = window.URL.createObjectURL(blob); //创建下载的链接
                            downloadElement.href = href;
                            downloadElement.download = '我的报表.xls'; //下载后文件名
                            document.body.appendChild(downloadElement);
                            downloadElement.click(); //点击下载
                            document.body.removeChild(downloadElement); //下载完成移除元素
                            window.URL.revokeObjectURL(href); //释放掉blob对象
                            // console.log(res);
                        });

                        // this.$Message.success('Success!');
                    } else {
                        this.$Message.error('提交失败!');
                    }
                })
            },

            //获取开始日期
            getStartDate:function(e){
                this.startDate = e;
            },

            //获取结束日期
            getEndDate:function(e){
                this.endDate = e;
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/style/_variables";
    .table{
        text-align: left;
        padding-top: $topMenu;
    }
    .table-title{
        @extend .global-title;
        border-bottom: none;
        margin-bottom: 20px;
    }
    .table-title:before{
        @extend .global_b_bar;
    }

</style>
