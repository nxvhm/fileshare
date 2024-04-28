import express from "express";
import UploadController from '@/controllers/files/Upload.js';
import FileListController from '@/controllers/files/FileList.js';
import DeleteFileController from '@/controllers/files/DeleteFile.js';
import DownloadFileController from '@/controllers/files/DownloadFile.js';
import ShareFileController from '@/controllers/files/Share.js';
import BreadcrumbsController from '@/controllers/files/Breadcrumbs.js';

const router = express.Router();

router.use(UploadController);
router.use(FileListController);
router.use(DeleteFileController);
router.use(DownloadFileController);
router.use(BreadcrumbsController);
router.use(ShareFileController);

export default router;
