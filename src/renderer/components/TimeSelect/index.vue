<template>
    <el-dialog
        :visible.sync="show"
        :close-on-click-modal="false"
        :center="true"
        title="设置"
    >

        <el-form ref="form" label-position="left" size="mini" :model="d" label-width="80px">

            <el-form-item>
                <el-radio-group v-model="d.type" size="mini">
                    <el-radio-button label="step">间隔</el-radio-button>
                    <el-radio-button label="time">日期</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="日期" v-show="d.type == 'time'">
                <el-date-picker
                        v-model="d.time"
                        type="datetime"
                        :format="dateTimeFormat"
                        :value-format="dateTimeFormat"
                        placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="之后" v-show="d.type == 'step'">

                <el-col :sm="8">
                    <el-input-number
                            v-model="d.step"
                            size="mini"
                            controls-position="right"
                            :min="1"></el-input-number>

                </el-col>
                <el-col :sm="6" style="margin-left: 10px">
                    <el-select size="mini" v-model="d.duration" placeholder="">
                        <el-option v-for="t in durationList" :label="t.label" :value="t.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>

        </el-form>

        <!--表单控制区-->
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.stop="onSubmit">更改</el-button>
            <el-button @click.stop="close">取消</el-button>
        </div>

    </el-dialog>
</template>

<script>
  import moment from 'moment';
  import { clone } from '../../utils';
  // 支持的度量有 years、months、weeks、days、hours、minutes 和 seconds
  import duration from './duration.json';
  const durationList = Object.keys(duration).map(k=>{
    return {
      label: duration[k],
      value: k
    }
  });
  const TYPE = {TIME: 'time', STEP: 'step'};
  const DEFAULT_DATA = {
    type: TYPE.STEP,
    time: moment().format('YYYY-MM-DD HH:mm:ss'),
    step: 1,
    duration: 'minutes'
  };
  export default {
    name: "settings",
    data(){
      return {
        show: false,
        dateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
        type: 'datetime', //
        d: clone(DEFAULT_DATA),
        durationList: durationList
      }
    },
    methods: {
      open(){
        this.show = true;
      },
      onSubmit(){
        this.$emit('submit' , clone(this.d));
        this.close();
      },
      close(){
        this.show = false;
      }
    }
  }
</script>

<style scoped>

</style>