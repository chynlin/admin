import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// 定义API函数
const apiFunctions = [
  {
    apiPath: 'order/create',
    fnName: 'createOrder',
    fnDescription: '新增訂單',
    successMessage: '訂單創建成功',
  },
  {
    apiPath: 'order/update',
    fnName: 'updateOrder',
    fnDescription: '修改訂單',
    successMessage: '訂單更新成功',
  },
  {
    apiPath: 'order/delete',
    fnName: 'deleteOrder',
    fnDescription: '刪除訂單',
    successMessage: '訂單刪除成功',
  },
];

const addFunction = ({ apiPath, fnName, fnDescription, successMessage }) => {
  return new Promise((resolve, reject) => {
    const command = `npm run api -- ${apiPath} ${fnName} "${fnDescription}" "${
      successMessage || ''
    }"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}\n${error}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Error output: ${stderr}`);
        reject(stderr);
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
};

const processBatch = async () => {
  for (const apiFunction of apiFunctions) {
    await addFunction(apiFunction);
  }
  console.log('All functions added successfully.');
};

processBatch();
