import axios from 'axios';
import fileDownload from 'js-file-download';

import { API } from '@api';
import { toast } from '@app/common/functionCommons';
import { CONSTANTS } from '@constants';

export function downloadByFileId(fileId, fileName) {
  return axios.get(API.FILE_ID.format(fileId), { responseType: 'blob' })
    .then(res => {
      if (res.data) fileDownload(res.data, fileName);
      return null;
    })
    .catch(() => {
      return toast(CONSTANTS.ERROR, 'File đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra và thử lại');
    });
}
