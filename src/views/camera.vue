<template>
  <div class="room-main-container">
    <!-- <el-dialog
        title="登录账号"
        :visible.sync="dialogVisible"
        width="450px"
        height="200px"
        :destroy-on-close="true">
      <Login @loginResult="handleLogin"></Login>
    </el-dialog> -->
    <div class="room-left">
      <!-- <div v-if="isLive()" class="room-left-video">
        <ArtPlayerTest ref="childPlayer" v-if="isLive()" class="room-left-video-play" @notSupport="notSupport"
                       @newDanmuSend="newDanmuSend" :platform="platform" :room-id="roomId"
                       :is-live="isLive" :ban-active="banActive" :ban-level="banLevel"
                       :ban-content-list="banContentList" :checked-content-list="checkedContentList"
                        :danmu-style="danmuStyle" :danmu-speed="danmuSpeed" :danmu-area="danmuArea"
                        :danmu-num="danmuNum"/>
      </div> -->
      <!-- <div v-else class="room-left-video-notLive">直播间未开播</div> -->

      
      <div class="room-left-info">

        <!-- <div class="room-left-info-head">
          <el-image class="head-pic" :src=roomInfo.ownerHeadPic :preview-src-list="getPreList(roomInfo.ownerHeadPic)"  />
        </div>
        <div class="room-left-info-after-head">
          <div class="room-left-info-after-head-name">
            <div :class="isLive() ? 'info-isLive' : 'info-notLive'">{{ isLive() ? "直播中" : "未开播" }}</div>{{ roomInfo.roomName }}
          </div>
          <div class="room-left-info-after-head-owner">
            {{ getPlatform(platform) }} · {{ roomInfo.ownerName }}
          </div>
        </div> -->



        <!-- <div class="room-left-info-right">
          <div class="room-left-info-right-link">
            <el-tooltip class="item" effect="dark" content="跳转到直播间" placement="top">
              <a :href="getUrl()" target="_blank"><i class="el-icon-link"></i></a>
            </el-tooltip>
          </div>
          <div v-if="platform != 'cc'" class="room-left-info-right-ban">
            <el-popover
                placement="bottom"
                width="330"
                trigger="manual"
                v-model="popoverVisible"
                @hide="banCancel()">
              <el-form v-loading="loading" label-position="left" :model="form" size="mini">
                <div v-if="isLogin != 'true'" class="room-left-info-right-ban-login-div" >
                  <div class="room-left-info-right-ban-login" @click="dialogVisible = true">登录保存屏蔽信息</div>
                </div>
                <el-form-item label="屏蔽开关">
                  <el-switch v-model="banActiveTemp"></el-switch>
                </el-form-item>
                <el-form-item :label="getPlatform(platform) + levelBanTxt">
                  <el-input-number class="user-level" :disabled="platform=='huya'?true:false" v-model="banLevelTemp" :min="1" :max="99" controls-position="right" label="描述文字"></el-input-number>
                  <div v-if="platform=='huya'" style="font-weight: lighter">(虎牙暂不支持)</div>
                </el-form-item>
                <div class="global-ban">
                  <span>关键词屏蔽</span><span style="font-weight: lighter;font-size: 15px">(支持正则)</span>
                </div>
                <div class="ban-content-div">
                  <el-input id="contentInput" v-model="newContent" placeholder="请输入屏蔽内容" size="small"></el-input>
                  <el-button v-if="!hasNewContent(newContent)" disabled class="ban-content-btn" type="primary" size="small">添加</el-button>
                  <el-button v-if="hasNewContent(newContent)" @click="addBan(newContent)" class="ban-content-btn" type="primary" size="small">添加</el-button>
                </div>
                <div style="margin-bottom: 10px">屏蔽列表(勾选生效)</div>
                <div class="ban-content-list">
                  <el-checkbox-group v-model="checkedContentListTemp">
                    <el-row :gutter="20">
                      <el-col style="position: relative;margin-bottom: 10px;overflow-x: hidden" :span="12" v-for="(content, index) in banContentListComputed" :key="index">
                        <div @mouseover="overCheck($event)" @mouseout="outCheck($event)">
                          <el-checkbox style="overflow: hidden;" :label="content"></el-checkbox>
                          <i class="el-icon-error ban-content-list-icon" @click="deleteContent($event)"></i>
                        </div>
                      </el-col>
                    </el-row>
                  </el-checkbox-group>
                </div>
                <div class="danmu-style-title">弹幕样式设置</div>
                <div class="danmu-cap-div">
                  <span>不透明度</span><el-slider :show-tooltip="false" @change="saveFont" class="danmu-cap" v-model="danmuStyle.opacity"></el-slider><span class="danmu-cap-value">{{ danmuStyle.opacity }}%</span>
                </div>
                <div class="danmu-cap-div">
                  <span>弹幕字号</span><el-slider :show-tooltip="false" @change="saveFont" class="danmu-cap" v-model="danmuStyle.fontSize"></el-slider><span class="danmu-cap-value">{{ danmuStyle.fontSize }}%</span>
                </div>
                <div class="danmu-cap-div">
                  <span>字体粗细</span><el-slider :show-tooltip="false" @change="saveFont" :step="50" show-stops class="danmu-cap" v-model="danmuStyle.fontWeight"></el-slider><span class="danmu-cap-value">{{ weightWord(danmuStyle.fontWeight) }}</span>
                </div>
                <div class="danmu-cap-div">
                  <span>弹幕描边</span><el-switch v-model="danmuStyle.textShadow" style="margin-left: 20px"></el-switch>
                </div>
                <div class="danmu-cap-div">
                  <span>弹幕速度</span><el-slider :show-tooltip="false" @change="saveFont" :step="20" show-stops class="danmu-cap" v-model="danmuSpeed"></el-slider><span class="danmu-cap-value">{{ speedWord(danmuSpeed) }}</span>
                </div>
                <div class="danmu-cap-div">
                  <span>显示区域</span><el-slider :show-tooltip="false" @change="saveFont" :step="25" show-stops class="danmu-cap" v-model="danmuArea"></el-slider><span class="danmu-cap-value">{{ areaWord(danmuArea) }}</span>
                </div>
                <div class="danmu-cap-div">
                  <span>同屏密度<br/>(建议只在弹幕过多时使用)</span><el-slider :show-tooltip="false" @change="saveFont" :step="10" show-stops class="danmu-cap" v-model="danmuNum"></el-slider><span class="danmu-cap-value">{{ danmuNum }}%</span>
                </div>
                <div style="text-align: center">
                  <el-button size="small" @click="banCancel()">取消</el-button>
                  <el-button type="primary" size="small" @click="activeBan()">确定</el-button>
                </div>
              </el-form>
              <div slot="reference" @click="popoverVisible = !popoverVisible"><i class="el-icon-remove-outline"></i></div>
            </el-popover>
          </div>
          <div class="room-left-info-right-follow">
            <el-button @click="followRoom()" :type="followed ? 'info' : 'primary'" size="mini">
              <i :class="followed ? 'el-icon-star-on' : 'el-icon-star-off'" style="font-size: 20px;"></i>
              <span class="follow-btn" v-text="followed ? '已关注' : '关注'"></span>
            </el-button>
          </div>
        </div> -->
      </div>
    </div>
    <!-- <div class="room-right">
      <div class="room-right-top">
        直播聊天
      </div>
      <div class="room-right-body">
        <div class="room-right-body-danmu-box" v-if="danmuSupport">
          <transition-group name="danmu">
            <div class="room-right-show-danmu" v-for="(danmu, index) in danmuList" :key="index">
              <span class="danmu-name">{{ danmu.fromName }}:</span>
              <span class="danmu-msg">{{ danmu.msg }}</span>
            </div>
          </transition-group>
        </div>
        <div class="not-support" v-else>
          暂不支持{{getPlatform(platform)}}的弹幕
        </div>
      </div>
      <div v-if="!isBottom" @click="toBottom()" class="to-bottom">
        返回底部
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
    data() {
        return {
            roomInfo: {},
        }
    },
    methods:{
        isLive(){
            let state = this.roomInfo.isLive
            if (state == "0"){
                return false
            }else {
                return true
            }
        },
    }

}
</script>


