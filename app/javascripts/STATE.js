(function (window) {
    define([], function () {
        return {
            START_ENTRY : 10001,
            RETRY_ENTRY : 10002,
            INNER_RETRY : 10003,
            START_PAGE : 0,
            IDENTIFY_SUCCESS : 1,  // final success state
            ADB_SUCCESS : 2,
            // ////////////////////////////////////////////////////////////////////////
            // User Canceled
            // ////////////////////////////////////////////////////////////////////////
            USER_CANCELED : -1,
            // ////////////////////////////////////////////////////////////////////////
            // All Failed State, lower than -1
            // ////////////////////////////////////////////////////////////////////////
            OFFLINE : -10,  // show offline page
            START_CDROM_FAILED : -11,  // show start cdrom failed page
            INSTALL_STRAGY_UNKNOWED : -12,  // config error, could not handle
            NO_DRIVER : -13,  // show no driver page
            DOWNLOAD_DRIVER_FAILED : -14,  // show download driver failed page
            // some device could has those detail state, if ui don't need to show detail, could handle as INSTALL_DRIVER or INSTALL_DEIVER_FAILED
            INSTALL_DRIVER_FAILED : -15,  // show install driver failed page
            INSTALL_DRIVER_PRE_FAILED : -16,  // show install pre driver failed page
            INSTALL_DRIVER_POST_FAILED : -17,  // show install post driver failed page
            ALL_STEP_SUCCESS_BUT_ADB_NOT_FOUND : -18,  // all success, bug failed.
            APK_INSTALL_FAILED : -19,  // install apk failed
            APK_INVALID : -20,  // Invalid Apk
            APK_UPDATING_FAILED : -21,  // update apk failed
            CONNECTION_CREATE_FAILED : -22,  // create connection failed
            CONNECTION_FORWARD_FAILED : -23,  // forward connection port failed
            CONNECTION_IDENTIFY_FAILED : -24,  // identify device info failed
            UNKNOWN_FAILED : -25,  // unknown connect failed
            APK_NOT_SUPPORT_SDK_VERSION : -26,  // sdk is under 2.0
            STORAGE_INSUFFICIENT : -27,  // storage is insufficient
            RECOVERY : -29,  // Phone enter recovery mode
            INSTALLED_DRIVER_MANY_TIMES_BUG_FAILED : -30,
            INSTALL_APK_FAILED_INTERNAL_ERROR : -31,  // No use should be deleted
            NOT_ALLOW_INSTALL_APK : -32,
            APK_INSTALL_CANCELED_BY_USER : -33,
            // ////////////////////////////////////////////////////////////////////////
            // All Processing State, bigger than 1, lowwer than 100
            // ////////////////////////////////////////////////////////////////////////
            ADB_DEBUG_CLOSE : 10,  // show adb debug close page
            OFFLINE_OR_ADBDEBUG_CLOSE : 11,  // show adb debug close or offline page
            WINDOWS_LOADING_DRIVER : 12,  // show windows loading driver page
            DOWNLOADING_DRIVER : 13,  // show downing driver, inclding progress
            INSTALL_DRIVER : 14,  // show installing driver page
            INSTALL_DRIVER_PRE : 15,  // show installing pre driver page
            INSTALL_DRIVER_POST : 16,  // show installing post driver page
            // install and lunch apk
            APK_INSTALLING : 17,
            APK_UPDATING : 18,
            APK_CHECKING : 19,
            // create connection
            CONNECTION_CREATING : 20,
            CONNECTION_FORWARDING : 21,
            CONNECTION_IDENTIFYING : 22,
            DRIVER_CONFLICT_VMWARE : 23,
            // Get identify Driver info failed, should record
            CHECK_NONE_DRIVER_RETURN : 24,
            // Ask user if flashing device
            CHECK_IS_USER_WANTTED_REINSTALL_DRIVER : 25,
            CONFIRM_TO_REINSTALL_DRIVER : 26,
            // Huawei Mount
            HUAWEI_SD_CARD_MOUNTED : 27,
            // Install Driver User Canceled
            INSTALL_DRIVER_CANCELED : 28,
            // Should Restart PC to continue
            INSTALL_DRIVER_SUCCESS_BUT_SHOULD_RESTART : 29,
            // Means Moto Driver Conflicted.
            DRIVER_CONFLICT_MOTO : 30,  // No use should be deleted.
            // Means Composite Device Driver Error, And Error Code : 38
            COMPOSITE_DRIVER_ERROR_CODE_38 : 31,  // No use should be deleted
            // Means ADB Interface Driver Error, And Error Code : 38
            ADB_DRIVER_ERROR_CODE_38 : 32,
            // Means Composite Driver Load Error
            COMPOSITE_DRIVER_LOAD_ERROR_NEXUS7 : 33,  // No use should be deleted
            COMPOSITE_DRIVER_LOAD_ERROR_MOTO : 34,  // No use should be deleted
            COMPOSITE_DRIVER_LOAD_ERROR_OTHER : 35,  // No use should be deleted
            PHONE_POWEROFF : 36,  // some phone adb can be used when power off.
            ADB_SERVER_DONT_ACK : 37,  // adb server didn't ack, need to be killed.
            COMPOSITE_DRIVER_NOT_READY : 38,
            USB_DEVICE_MAY_BE_PLUGOUT : 39,
            // Start Diagnose Device
            START_DIAGNOSE_DEVICE : 98,
            // enter connection guide.
            START_CONNECTION_GUIDE : 99,
            // ////////////////////////////////////////////////////////////////////////
            // All internal state, bigger than 100
            // ////////////////////////////////////////////////////////////////////////
            DEVICE_REMOVED : 100,
            ADB_NAME_READY : 101,  // show adb name success, and connect device
            UPZIP_DRIVER : 102,  // show upzip driver page
            // checking driver state
            CHECKING_DRIVER : 103,
            INSTALL_DRIVER_SUCCESS : 104,  // Show install driver success page
            DOWNLOAD_DRIVER_SUCCESS : 105,
            APK_INSTALL_SUCCESS : 106,
            FIRST_PART_CHECKED : 107,
            MIDDLE_PART_CHECKED : 108,
            CONNECTION_IDENTIFY_SUCCESS_CANDIDATE : 109,
            CHECKING_IS_APK_INSTALL_SUCCESS : 110,
            LOG_DRIVER_INSTALL_SUCCESS : 111,
            LOG_DRIVER_INSTALL_FAILED : 112,
            LOG_IDENTIFYING_IFNO_REPEAT : 113,
            LOG_INSTALL_APK_FAILED_UNPLUG_DEVICE : 114,  // Install Apk Failed because of user unplug device
            LOG_RETRIEVE_INFO_FAILED_UNPLUG_DEVICE : 115,  // Retrieve info Failed because of user unplug device
            LOG_OTHER_FAILED_UNPLUG_DEVICE : 116,  // Other connect Failed because of user unplug device
            LOG_FAILED_DEVICE_NOT_ONLINE : 117,  // Failed because of device not online now
            LOG_INSTALL_SUCCESS_FROM_DEVICE_NOTRESPONSE : 118,  // if INSTALL_FAILED_DEVICE_NOTRESPONSE, try restart to check again, // After testing, this not useful
            LOG_ALL_GOOD_FAILED_UNPLUG_DEVICE : 119,  // If unplug device caused all good
            LOG_INSTALL_APK_SUCCESS_FROM_DELETE_TMP_FILES : 120,
            START_INSTALL_DRIVER : 150,
            START_CHECK_ADB_NAME : 151,
            END_CHECK_ADB_NAME : 152,
            FORWARD_APK_SUCCESS : 154,
            IDENTIFY_APK_SUCCESS : 155,
            ASK_ALLOW_INSTALL_APK : 1000
        };
    });
}(this));
