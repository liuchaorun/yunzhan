const overview = require('../../controllers/overview');
const screenManagement = require('../../controllers/screen-management');
const advertisementManagement = require('../../controllers/advertisement-management');
const tagManagement = require('../../controllers/tag-management');
const resourcePackManagement = require('../../controllers/resource-pack-management');

module.exports = (router) => {
    let prefix = (url) => `/server/admin/${url}`;

    let overviewPrefix = (url)=> prefix(`overview/${url}`);
    router.get(overviewPrefix('getLoginInfo'), overview.getTagInfo);
    router.get(overviewPrefix('getScreenInfo'), overview.getScreenInfo);
    router.get(overviewPrefix('getAdvertisementInfo'), overview.getAdvertisementInfo);
    router.get(overviewPrefix('getResourcePackInfo'), overview.getResourcePackInfo);
    router.get(overviewPrefix('getTagInfo'), overview.getTagInfo);

    let screenManagementPrefix = (url) => prefix(`screenManagement/${url}`);
    router.get(screenManagementPrefix('getBasicInfo'), screenManagement.getBasicInfo);
    router.get(screenManagementPrefix('getLogList'), screenManagement.getLogList);
    router.get(screenManagementPrefix('getScreenList'), screenManagement.getScreenList);
    router.post(screenManagementPrefix('unbindResourcePack'), screenManagement.unbindResourcePack);
    router.post(screenManagementPrefix('addScreen'), screenManagement.addScreen);
    router.post(screenManagementPrefix('deleteScreen'), screenManagement.deleteScreen);
    router.post(screenManagementPrefix('startScreen'), screenManagement.startScreen);
    router.post(screenManagementPrefix('stopScreen'), screenManagement.stopScreen);
    router.post(screenManagementPrefix('bindResourcePack'), screenManagement.bindResourcePack);

    let advertisementManagementPrefix = (url) => prefix(`advertisementManagement/${url}`);
    router.get(advertisementManagementPrefix('getBasicInfo'), advertisementManagement.getBasicInfo);
    router.post(advertisementManagementPrefix('uploadVideo'), advertisementManagement.uploadVideo);
    router.post(advertisementManagementPrefix('uploadImage'), advertisementManagement.uploadImage);
    router.get(advertisementManagementPrefix('getAdvertisementList'), advertisementManagement.getAdvertisementList);
    router.get(advertisementManagementPrefix('getAdvertisementInfo'), advertisementManagement.getAdvertisementInfo);

    let tagManagementPrefix = (url) => prefix(`tagManagement/${url}`);
    router.get(tagManagementPrefix('getBasicInfo'), tagManagement.getBasicInfo);
    router.post(tagManagementPrefix('submitNewTag'), tagManagement.submitNewTag);
    router.get(tagManagementPrefix('getTagList'), tagManagement.getTagList);
    router.get(tagManagementPrefix('getTagInfo'), tagManagement.getTagInfo);
    router.post(tagManagementPrefix('changeTagInfo'), tagManagement.changeTagInfo);

    let resourcePackManagementPrefix = (url) => prefix(`resourcePackManagement/${url}`);
    router.get(resourcePackManagementPrefix('getBasicInfo'), resourcePackManagement.getBasicInfo);
    router.post(resourcePackManagementPrefix('submitNewResourcePack'), resourcePackManagement.submitNewResourcePack);
    router.get(resourcePackManagementPrefix('getResourcePackList'), resourcePackManagement.getResourcePackList);
    router.get(resourcePackManagementPrefix('getResourcePackTagList'), resourcePackManagement.getResourcePackTagList);
    router.get(resourcePackManagementPrefix('getResourcePackAdvertisementList'), resourcePackManagement.getResourcePackAdvertisementList);
    router.get(resourcePackManagementPrefix('getResourcePackScreenList'), resourcePackManagement.getResourcePackScreenList);
    router.get(resourcePackManagementPrefix('getResourcePackUnbindingTagList'), resourcePackManagement.getResourcePackUnbindingTagList);
    router.get(resourcePackManagementPrefix('getResourcePackUnbindingAdvertisementList'), resourcePackManagement.getResourcePackUnbindingAdvertisementList);
    router.post(resourcePackManagementPrefix('changeResourcePackInfo'), resourcePackManagement.changeResourcePackInfo);
};
