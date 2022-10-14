export const API = {
  LOGIN: '/backend/api/auth/signin',
  USERS: '/api/users',
  USER_DA_XOA: '/api/users/daxoa',
  USER_DA_XOA_ID: '/api/users/daxoa/{0}',
  USER_ID: '/api/users/{0}',
  MY_INFO: '/backend/api/user/me',
  UPDATE_MY_INFO: '/api/users/info',
  REFRESH_TOKEN: '/backend/api/auth/refreshtoken',

  DON_VI: '/api/donvi',
  DON_VI_ID: '/api/donvi/{0}',

  TINH_THANH: '/api/tinhthanh',
  TINH_THANH_ID: '/api/tinhthanh/{0}',

  QUAN_HUYEN: '/api/quanhuyen',
  QUAN_HUYEN_ID: '/api/quanhuyen/{0}',

  PHUONG_XA: '/api/phuongxa',
  PHUONG_XA_ID: '/api/phuongxa/{0}',

  FILE: '/api/file',
  FILE_ID: '/api/file/{0}',
  FILE_NAME_ID: '/api/file/?id={0}&file_name={1}',
  PREVIEW_ID: '/api/file/preview/{0}',

  ROLE: '/api/role',
  ROLE_ID: '/api/role/{0}',

  SETTING: '/api/caidathethong',
  SETTING_ID: '/api/caidathethong/{0}',

  USER_RESET_PASSWORD: '/api/users/reset-password',
  USER_CHANGE_PASSWORD: '/api/users/change-password',
  USER_FORGET_PASSWORD: '/api/users/forgot-password-mail',

  NOTIFICATION: '/backend/api/notification',
  NOTIFICATION_ID: '/backend/api/notification/{0}',

  ALL_DATASET: '/backend/api/dataset?count=1',
  IMPORT_DATASET: '/api/users/{0}/import',
  MERGE_DATASET: '/api/users/{0}/merge_dataset',
  DATASET: '/api/dataset',
  DATASET_ID: '/backend/api/dataset/{0}',
  CREATE_DATASET: '/backend/api/dataset',
  DATASET_IMAGE: '/backend/api/image',

  IMG_DETAIL: '/backend/api/image/{0}',
  LABEL_BY_DATASET_ID: '/backend/api/label/{0}',
  IMG_DELETE: '/backend/api/image/{0}',

  DONVIS: '/api/dataset/{0}/work_address',

  USERS_FILTER: '/api/dataset/{0}/users?id_work_address={1}',
  ALL_DONVI: '/api/users/{0}/work_address',
  USER_SHARE: '/api/{0}/share',
  ALL_USERS: '/api/role_user',

  CREATE_AUGMENTATION: '/api/{0}/augmentation',

  UPLOAD_IMG: '/backend/api/dataset/addimages/{0}',

  ALL_USER: '/backend/api/user',
  CREATE_USER: '/backend/api/auth/signup',
  UPDATE_USER: '/backend/api/user/{0}',
  DELETE_USER: '/backend/api/user/{1}',
  CHANGE_PW: '/api/users/{0}/reset',
  CHANGE_PWS: '/backend/api/user/change-password',
  CREATE_CAMERA_CATE: '/backend/api/cameracate',
  ALL_CAMERA_CATE: '/backend/api/cameracate',
  FIND_CAMERA_CATE: '/backend/api/cameracate/{0}',

  ALL_CAMERA: '/backend/api/camera/all',
  CREATE_CAMERA: '/backend/api/camera',
  UPDATE_CAMERA: '/backend/api/camera/{0}',
  DELETE_CAMERA: '/backend/api/camera/{1}',
  STOP_STREAM: '/backend/api/camera/stream/stop-stream',
  PLAY_STREAM: '/backend/api/camera/stream/start-stream',
  CAMERA_CATE: '/backend/api/cameracate?count=1',
  CREATE_CAPTURE: '/backend/api/camera/capture_frame',
  FILTER_CAPTURE: '/backend/api/image',
};
