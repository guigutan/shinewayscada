//service-install.cjs（CommonJS 版本，显示所有可访问地址）
const Service = require('node-windows').Service;
const path = require('path');
const fs = require('fs');
const os = require('os'); // 用于获取本机 IP

// 第一步：读取 vite.config.ts，提取 preview 配置（port + allowedHosts）
function getVitePreviewConfig() {
  try {
    const viteConfigPath = path.resolve(__dirname, 'vite.config.ts');
    const configContent = fs.readFileSync(viteConfigPath, 'utf8');

    // 1. 匹配 preview.port
    const portRegex = /preview:\s*\{\s*[\s\S]*?port:\s*(\d+)/;
    const portMatch = configContent.match(portRegex);
    const port = portMatch ? parseInt(portMatch[1], 10) : 5173;

    // 2. 匹配 preview.allowedHosts（提取配置的域名）
    const allowedHostsRegex = /preview:\s*\{\s*[\s\S]*?allowedHosts:\s*\[(.*?)\]/;
    const hostsMatch = configContent.match(allowedHostsRegex);
    let allowedHosts = [];
    if (hostsMatch && hostsMatch[1]) {
      // 解析数组中的域名（去掉引号、空格）
      allowedHosts = hostsMatch[1]
        .split(',')
        .map(host => host.replace(/['"\s]/g, ''))
        .filter(host => host); // 过滤空值
    }

    return { port, allowedHosts };
  } catch (err) {
    console.error('⚠️ 读取 vite.config.ts 失败，使用默认配置：', err.message);
    return { port: 5173, allowedHosts: [] };
  }
}

// 第二步：获取本机所有 IPv4 地址（排除内网回环地址）
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const dev in interfaces) {
    const iface = interfaces[dev];
    for (const alias of iface) {
      // 只取 IPv4、非内网回环、非虚拟网卡地址
      if (alias.family === 'IPv4' && !alias.internal) {
        ips.push(alias.address);
      }
    }
  }

  // 如果没找到外网 IP，补充 127.0.0.1
  if (ips.length === 0) {
    ips.push('127.0.0.1');
  }
  return ips;
}

// 第三步：生成所有可访问的地址列表
function generateAccessAddresses() {
  const { port, allowedHosts } = getVitePreviewConfig();
  const localIPs = getLocalIPs();

  // 基础地址（localhost + 本机 IP）
  const baseAddresses = [
    `http://localhost:${port}`,
    `http://127.0.0.1:${port}`,
    ...localIPs.map(ip => `http://${ip}:${port}`)
  ];

  // 配置的域名地址（allowedHosts）
  const domainAddresses = allowedHosts.map(host => `http://${host}:${port}`);

  // 合并所有地址并去重
  const allAddresses = [...new Set([...baseAddresses, ...domainAddresses])];
  return { allAddresses, port };
}

// 获取所有可访问地址和端口
const { allAddresses, port } = generateAccessAddresses();

// 确认 service-start.cjs 的路径
const scriptPath = path.resolve(__dirname, 'service-start.cjs');

// 创建 Windows 服务对象
const svc = new Service({
  name: 'ShinewayScada',
  description: '兴晖看板前端服务',
  script: scriptPath,
  nodeOptions: ['--harmony'],
  silent: true,
  env: [{ name: 'NODE_ENV', value: 'production' }]
});

// 监听安装完成事件
svc.on('install', () => {
  console.log('✅ 服务安装完成！正在启动服务...');
  svc.start();
});

// 监听启动成功事件（显示所有可访问地址）
svc.on('start', () => {
  console.log(`✅ 服务 ${svc.name} 已启动！`);
  console.log(`📌 服务端口：${port}`);
  console.log('🔗 所有可访问地址：');
  // 逐行输出所有地址，更清晰
  allAddresses.forEach((addr, index) => {
    console.log(`   ${index + 1}. ${addr}`);
  });
});

// 监听启动失败事件
svc.on('error', (err) => {
  console.error('❌ 服务启动失败：', err.message);
  console.error(`💡 预期端口：${port}，请检查 service-start.cjs 和 vite 依赖`);
});

// 监听卸载事件
svc.on('uninstall', () => {
  console.log('✅ 服务已卸载！');
});

// 执行安装（卸载时改为 svc.uninstall()）
svc.install();
