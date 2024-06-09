import _ from 'lodash';
import { ZoomMtg } from "@zoom/meetingsdk";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

const CLIENT_ID = "Iof2SUFTPWtvapdRHmkbQ";
const CLIENT_SECRET = "RfmXBq8w8s92uajBnBx4AHfHHNSOFTzM";

testTool = window.testTool;
document.getElementById("display_name").value +
  ZoomMtg.getWebSDKVersion()[0] +
  testTool.detectOS() +
  testTool.getBrowserInfo();
document.getElementById("meeting_number").value =
  testTool.getCookie("meeting_number");
document.getElementById("meeting_pwd").value =
  testTool.getCookie("meeting_pwd");
  
if (testTool.getCookie("meeting_lang"))
  document.getElementById("meeting_lang").value =
    testTool.getCookie("meeting_lang");

document.getElementById("meeting_lang").addEventListener("change", (e) => {
  testTool.setCookie(
    "meeting_lang",
    document.getElementById("meeting_lang").value
  );
  ZoomMtg.i18n.load(document.getElementById("meeting_lang").value);
  ZoomMtg.i18n.reload(document.getElementById("meeting_lang").value);
  ZoomMtg.reRender({ lang: document.getElementById("meeting_lang").value });
});

// copy zoom invite link to mn, autofill mn and pwd.
document
  .getElementById("meeting_number")
  .addEventListener("input", function (e) {
    let tmpMn = e.target.value.replace(/([^0-9])+/i, "");
    if (tmpMn.match(/([0-9]{9,11})/)) {
      tmpMn = tmpMn.match(/([0-9]{9,11})/)[1];
    }
    let tmpPwd = e.target.value.match(/pwd=([\d,\w]+)/);
    if (tmpPwd) {
      document.getElementById("meeting_pwd").value = tmpPwd[1];
      testTool.setCookie("meeting_pwd", tmpPwd[1]);
    }
    document.getElementById("meeting_number").value = tmpMn;
    testTool.setCookie(
      "meeting_number",
      document.getElementById("meeting_number").value
    );
  });

document.getElementById("clear_all").addEventListener("click", (e) => {
  testTool.deleteAllCookies();
  document.getElementById("display_name").value = "";
  document.getElementById("meeting_number").value = "";
  document.getElementById("meeting_pwd").value = "";
  document.getElementById("meeting_lang").value = "en-US";
  document.getElementById("meeting_role").value = 0;
  window.location.href = "/index.html";
});

document.getElementById("join_meeting").addEventListener("click", (e) => {
  e.preventDefault();

  const meetingConfig = testTool.getMeetingConfig();
  if (!meetingConfig.mn || !meetingConfig.name) {
    alert("Meeting number or username is empty");
    return false;
  }
  testTool.setCookie("meeting_number", meetingConfig.mn);
  testTool.setCookie("meeting_pwd", meetingConfig.pwd);

  const signature = ZoomMtg.generateSDKSignature({
    meetingNumber: meetingConfig.mn,
    sdkKey: CLIENT_ID,
    sdkSecret: CLIENT_SECRET,
    role: meetingConfig.role,
    success: function (res) {
      console.log(res);
      meetingConfig.signature = res;
      meetingConfig.sdkKey = CLIENT_ID;
      const joinUrl = "/meeting.html?" + testTool.serialize(meetingConfig);
      console.log(joinUrl);
      window.location.replace(joinUrl);
    },
  });
});

function copyToClipboard(elementId) {
  var aux = document.createElement("input");
  aux.setAttribute(
    "value",
    document.getElementById(elementId).getAttribute("link")
  );
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}

// click copy jon link button
window.copyJoinLink = function (element) {
  const meetingConfig = testTool.getMeetingConfig();
  if (!meetingConfig.mn || !meetingConfig.name) {
    alert("Meeting number or username is empty");
    return false;
  }
  const signature = ZoomMtg.generateSDKSignature({
    meetingNumber: meetingConfig.mn,
    sdkKey: CLIENT_ID,
    sdkSecret: CLIENT_SECRET,
    role: meetingConfig.role,
    success: function (res) {
      console.log(res);
      meetingConfig.signature = res;
      meetingConfig.sdkKey = CLIENT_ID;
      const joinUrl =
        testTool.getCurrentDomain() +
        "/meeting.html?" +
        testTool.serialize(meetingConfig);
      document.getElementById("copy_link_value").setAttribute("link", joinUrl);
      copyToClipboard("copy_link_value");
    },
  });
};
