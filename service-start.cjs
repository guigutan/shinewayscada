//service-start.cjs
const { spawn } = require('child_process');
const path = require('path');

// 关键：用项目内的 vite 可执行文件（Windows 下是 vite.cmd）
const vitePath = path.resolve(__dirname, 'node_modules/.bin/vite.cmd');

// 定义 vite preview 命令（指定具体路径，避免找不到命令）
function startVitePreview() {
  const vitePreview = spawn(
    'cmd.exe', 
    ['/c', `"${vitePath}" preview `],  //不带--host 0.0.0.0 --port 5173 统一在vite.config.ts配置    
    {
      cwd: path.resolve(__dirname),
      stdio: 'inherit',
      shell: true,
      // 可选：继承终端的环境变量（解决 pm2 环境变量缺失）
      env: { ...process.env, NODE_ENV: 'production' }
    }
  );

  vitePreview.on('exit', (code) => {
    console.log(`vite preview 进程退出，退出码：${code}`);
    if (code !== 0) {
      console.log('进程异常退出，3 秒后重启...');
      setTimeout(startVitePreview, 3000);
    }
  });

  vitePreview.on('error', (err) => {
    console.error('启动 vite preview 失败：', err);
  });
}

// 启动
startVitePreview();