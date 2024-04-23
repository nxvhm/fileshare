import express from "express";
import UploadController from '@/controllers/files/Upload';
import FileListController from '@/controllers/files/FileList';
import DeleteFileController from '@/controllers/files/DeleteFile';
import DownloadFileController from '@/controllers/files/DownloadFile';
import ShareFileController from '@/controllers/files/Share';
import BreadcrumbsController from '@/controllers/files/Breadcrumbs';

const router = express.Router();

router.use(UploadController);
router.use(FileListController);
router.use(DeleteFileController);
router.use(DownloadFileController);
router.use(BreadcrumbsController);
router.use(ShareFileController);

export default router;
