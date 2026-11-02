import type { Language } from './types'

export type TranslationParams = Record<string, string | number>

const hasOwn = (target: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(target, key)

/** Chinese source messages are the keys and the fallback locale. */
export const englishMessages: Readonly<Record<string, string>> = {
  当前版本: 'Current version',
  检查更新: 'Check for updates',
  更新发布地址尚未配置: 'The update feed is not configured',
  '开发模式已下载更新，不执行安装':
    'Update downloaded. Installation is disabled in development mode',
  已下载更新: 'Update downloaded',
  读取更新状态失败: 'Failed to load update status',
  应用更新失败: 'App update failed',
  更新操作正在进行: 'An update operation is already in progress',
  请先检查更新: 'Check for updates first',
  请先下载更新: 'Download the update first',
  应用正在退出: 'The app is shutting down',
  '检查中…': 'Checking…',
  已是最新: 'Up to date',
  下载更新: 'Download update',
  '发现新版本 v{version}': 'Version {version} is available',
  '下载中…': 'Downloading…',
  '已下载 {size} MB': '{size} MB downloaded',
  '下载进度 {progress}%': 'Downloaded {progress}%',
  安装并重启: 'Install and restart',
  '下载完成，可稍后安装；退出应用后需重新下载':
    'Ready to install. Quitting the app discards the download.',
  '安装中…': 'Installing…',
  '正在安装更新，请稍候': 'Installing the update. Please wait.',
  更新下载进度: 'Update download progress',
  更新说明: 'Release notes',
  '更新失败：{message}': 'Update failed: {message}',
  '安装更新并重启？': 'Install the update and restart?',
  '重启会短暂中断正在运行的站点和文件分享，并按退出设置清理 hosts。只有开启自动启动的服务会在重启后恢复。':
    'Restarting briefly interrupts sites and file sharing, and cleans up hosts according to your quit settings. Only services with auto-start enabled will resume.',
  选择语言: 'Select language',
  语言: 'Language',
  显示语言: 'Display language',
  切换后立即生效: 'Changes take effect immediately',
  设置: 'Settings',
  关闭: 'Close',
  新增: 'New',
  新增文件: 'Add files',
  新增站点: 'New site',
  文件: 'Files',
  文件数量: 'File count',
  站点: 'Sites',
  站点数量: 'Site count',
  全部启动: 'Start all',
  全部停止: 'Stop all',
  导入配置: 'Import configuration',
  导出全部配置: 'Export all configurations',
  收起: 'Collapse',
  更多操作: 'More actions',
  还没有任何站点: 'No sites yet',
  '添加本地文件夹，一键发布为可访问的本地站点':
    'Add a local folder to publish it as a local site',
  没有符合筛选条件的站点: 'No sites match your filters',
  '{files} 个文件 · {sites} 个站点 · {running} 运行中':
    'Files: {files} · Sites: {sites} · Running: {running}',
  '{count} 异常': 'Errors: {count}',
  '文件分享：\n同局域网设备扫码访问后自动下载文件':
    'File sharing:\nDevices on the same network can scan to download files',
  文件分享说明: 'About file sharing',
  '添加本地文件，同局域网设备访问链接即可自动下载':
    'Add local files for devices on the same network to download',
  '固定开启分享，无需手动启动': 'Sharing is always on, no need to start it manually',
  没有符合筛选条件的文件: 'No files match your filters',
  '文件列表，可横向滚动': 'File list, scroll horizontally',
  移除分享: 'Remove share',
  '将从列表中移除「{name}」，局域网分享链接将失效。':
    'Remove “{name}” from the list? Its network sharing link will stop working.',
  '移除分享：{name}': 'Remove share: {name}',
  文件已失效: 'File unavailable',
  分享服务未运行: 'Sharing service is not running',
  '未检测到局域网 IP': 'No local network IP detected',
  查看二维码: 'Show QR code',
  扫码访问: 'Scan to visit',
  文件已被删除或移动: 'File has been deleted or moved',
  在访达中显示: 'Show in Finder',
  '在访达中显示：{name}': 'Show in Finder: {name}',
  '在 Finder 中显示': 'Show in Finder',
  运行中: 'Running',
  已停止: 'Stopped',
  异常: 'Error',
  启动中: 'Starting',
  停止: 'Stop',
  启动: 'Start',
  详情与日志: 'Details and logs',
  编辑配置: 'Edit configuration',
  重启站点: 'Restart site',
  导出配置: 'Export configuration',
  删除站点: 'Delete site',
  '将删除站点「{name}」，其自定义域名也会从 hosts 中移除。':
    'Delete “{name}”? Its custom domain will also be removed from hosts.',
  '将删除站点「{name}」。': 'Delete “{name}”?',
  '{url} · 点击查看二维码，Cmd/Ctrl 点击打开':
    '{url} · Click for QR code, Cmd/Ctrl-click to open',
  本机: 'Local',
  局域网: 'LAN',
  全部: 'All',
  按状态筛选: 'Filter by status',
  '按状态筛选，当前：{status}': 'Filter by status, current: {status}',
  关键字: 'Keyword',
  编辑站点: 'Edit site',
  基础信息: 'Basic information',
  名称: 'Name',
  目录: 'Folder',
  '如：my-project': 'e.g. my-project',
  点击选择文件夹: 'Select folder',
  独立端口: 'Site port',
  端口: 'Port',
  'IP 访问使用，推荐 1024–65535': 'Used for IP access; recommended range: 1024–65535',
  填写端口: 'Enter port',
  启用局域网访问: 'Enable LAN access',
  '仅本机可通过 127.0.0.1 访问': 'Only this device can access via 127.0.0.1',
  '局域网内设备可通过本机 IP 访问':
    'Devices on the same network can access via this device’s IP',
  自定义域名: 'Custom domain',
  启用自定义域名: 'Enable custom domain',
  '保存时需管理员授权；当前含多个域名，保存后仅保留一个':
    'Administrator approval required when saving. Saving keeps only one of the current domains.',
  保存时需管理员授权: 'Administrator approval required when saving',
  '推荐ls后缀，如：app.ls': 'Use .ls, e.g. app.ls',
  代理规则: 'Proxy rules',
  '{count} 条': '{count} rules',
  路径前缀: 'Path prefix',
  目标地址: 'Target URL',
  来源替换: 'Change origin',
  路径重写: 'Rewrite path',
  删除规则: 'Delete rule',
  添加代理规则: 'Add proxy rule',
  高级选项: 'Advanced options',
  '未匹配到文件的路由回退到 index.html，适用于单页应用':
    'Fall back to index.html for unmatched routes in single-page apps',
  '附加 CORS 响应头': 'Add CORS headers',
  '为静态资源附加 Access-Control 头（默认关闭，首选同源反代）':
    'Add Access-Control headers to static files (off by default; a same-origin proxy is preferred)',
  应用启动时自动运行: 'Start with the app',
  '每次打开 LocalServe 时自动启动此站点': 'Start this site whenever LocalServe opens',
  说明: 'Help',
  目录检测通过: 'Folder validation passed',
  目录不存在或不是文件夹: 'Folder does not exist or is not a directory',
  '未找到 index.html': 'index.html not found',
  请填写名称: 'Enter a name',
  请选择根目录: 'Select a root folder',
  请填写端口: 'Enter a port',
  请填写自定义域名: 'Enter a custom domain',
  确认: 'Confirm',
  取消: 'Cancel',
  保存: 'Save',
  保存并启动: 'Save and start',
  保存立即生效: 'Save and apply now',
  站点详情: 'Site details',
  状态: 'Status',
  未配置: 'Not configured',
  代理: 'Proxy',
  访问链接: 'Access links',
  复制: 'Copy',
  在浏览器打开: 'Open in browser',
  日志来源: 'Log source',
  站点日志: 'Site logs',
  '共享端口 80 日志': 'Shared port 80 logs',
  访问: 'Access',
  错误: 'Error',
  信息: 'Info',
  搜索日志: 'Search logs',
  清空: 'Clear',
  导出: 'Export',
  自动滚动: 'Auto-scroll',
  暂无日志: 'No logs yet',
  访问二维码: 'Access QR code',
  局域网访问: 'LAN access',
  '手机与 Mac 连接同一 Wi-Fi 后扫码':
    'Connect your phone and Mac to the same Wi-Fi, then scan',
  复制地址: 'Copy URL',
  局域网地址不可用: 'LAN address unavailable',
  未配置自定义域名: 'Custom domain is not configured',
  点击复制二维码: 'Click to copy QR code',
  浏览器打开: 'Open in browser',
  行为: 'Behavior',
  关闭窗口时最小化到托盘: 'Minimize to tray on close',
  关闭窗口后继续在后台运行: 'Keep running in the background when the window closes',
  开机自启动: 'Launch at login',
  '登录系统时自动启动 LocalServe': 'Start LocalServe when you log in',
  域名与hosts: 'Domains and hosts',
  '退出应用时自动还原 hosts': 'Restore hosts when quitting',
  关闭可避免频繁的管理员授权: 'Turn off to avoid repeated administrator prompts',
  托管块: 'Managed hosts entries',
  暂无托管域名: 'No managed domains yet',
  '{count} 个域名': '{count} domains',
  关于: 'About',
  联系作者: 'Contact author',
  复制邮箱: 'Copy email address',
  邮箱已复制: 'Email address copied',
  复制邮箱失败: 'Failed to copy email address',
  使用说明: 'User guide',
  打开: 'Open',
  站点配置已导出: 'Site configuration exported',
  导出站点配置失败: 'Failed to export site configuration',
  站点配置已导入: 'Site configuration imported',
  配置导入失败: 'Failed to import configuration',
  导入站点配置失败: 'Failed to import site configuration',
  读取站点失败: 'Failed to load sites',
  读取文件分享失败: 'Failed to load file sharing',
  读取设置失败: 'Failed to load settings',
  '读取 hosts 信息失败': 'Failed to load hosts information',
  '站点已保存，但部分同步失败': 'Site saved, but some updates could not be synchronized',
  创建站点失败: 'Failed to create site',
  更新站点失败: 'Failed to update site',
  删除站点失败: 'Failed to delete site',
  启动站点失败: 'Failed to start site',
  停止站点失败: 'Failed to stop site',
  重启站点失败: 'Failed to restart site',
  启动全部站点失败: 'Failed to start all sites',
  停止全部站点失败: 'Failed to stop all sites',
  '文件分享已保存，但部分同步失败':
    'File sharing saved, but some updates could not be synchronized',
  '已添加，部分跳过：{detail}': 'Added, with some files skipped: {detail}',
  添加文件分享失败: 'Failed to add shared files',
  移除文件分享失败: 'Failed to remove shared file',
  更新文件分享失败: 'Failed to update shared file',
  设置更新失败: 'Failed to update settings',
  无法打开使用说明: 'Unable to open the user guide',
  打开站点失败: 'Failed to open site',
  显示站点目录失败: 'Failed to reveal site folder',
  读取日志失败: 'Failed to load logs',
  已复制到剪贴板: 'Copied to clipboard',
  复制地址失败: 'Failed to copy URL',
  清空日志失败: 'Failed to clear logs',
  日志已导出: 'Logs exported',
  导出日志失败: 'Failed to export logs',
  生成二维码失败: 'Failed to generate QR code',
  复制地址成功: 'URL copied',
  复制二维码成功: 'QR code copied',
  复制二维码失败: 'Failed to copy QR code',
  检测目录失败: 'Failed to validate folder',
  选择文件夹失败: 'Failed to select folder',
  保存失败: 'Save failed',
  打开文件分享失败: 'Failed to open shared file',
  显示分享文件失败: 'Failed to reveal shared file',
  '端口需为 1-65535 之间的整数': 'Port must be an integer between 1 and 65535',
  '端口 80 已保留给自定义域名共享入口':
    'Port 80 is reserved for the shared custom-domain listener',
  '端口 19800 已保留给文件分享': 'Port 19800 is reserved for file sharing',
  'Tauri 命令执行失败': 'Tauri command failed',
  'configVersion 由应用维护': 'configVersion is managed by the app',
  '主机只能是 127.0.0.1 或 0.0.0.0': 'Host must be 127.0.0.1 or 0.0.0.0',
  根目录不能为空: 'Root folder cannot be empty',
  站点名称不能为空: 'Site name cannot be empty',
  '暂不支持 HTTPS': 'HTTPS is not supported yet',
  文件分享端口已保留: 'This port is reserved for file sharing',
  '端口不能为 0': 'Port cannot be 0',
  '端口必须在 1 到 65535 之间': 'Port must be between 1 and 65535',
  代理前缀不能为空: 'Proxy prefix cannot be empty',
  代理前缀不能包含查询参数或片段:
    'Proxy prefix cannot contain query parameters or fragments',
  代理前缀不能包含空白字符: 'Proxy prefix cannot contain whitespace',
  '代理前缀必须以 / 开头': 'Proxy prefix must start with /',
  代理目标不能包含用户名或密码: 'Proxy target cannot contain a username or password',
  '代理目标只能使用 http 或 https': 'Proxy target must use http or https',
  代理目标必须包含主机: 'Proxy target must include a host',
  '代理目标必须是有效 URL': 'Proxy target must be a valid URL',
  '代理规则 ID 重复': 'Duplicate proxy rule ID',
  规范化后的代理前缀重复: 'Duplicate normalized proxy prefix',
  规范化后的域名重复: 'Duplicate normalized domain',
  'localhost 是保留主机名': 'localhost is a reserved hostname',
  '.local 域名使用 mDNS，可能需要额外的 hosts 配置':
    '.local domains use mDNS and may need additional hosts configuration',
  域名不能为空: 'Domain cannot be empty',
  '域名不能包含 NUL 字符': 'Domain cannot contain NUL characters',
  域名不能包含斜杠: 'Domain cannot contain slashes',
  域名不能包含空白字符: 'Domain cannot contain whitespace',
  域名不能包含端口或冒号: 'Domain cannot contain ports or colons',
  '域名不能是 IP 地址': 'Domain cannot be an IP address',
  '域名只能包含 ASCII 字符': 'Domain must contain only ASCII characters',
  域名标签不能为空: 'Domain labels cannot be empty',
  域名标签不能以连字符开头或结尾: 'Domain labels cannot start or end with a hyphen',
  '域名标签只能包含字母、数字和连字符':
    'Domain labels may contain only letters, numbers, and hyphens',
  '域名标签长度不能超过 63 个字符': 'Domain labels cannot exceed 63 characters',
  '域名长度不能超过 253 个字符': 'Domain cannot exceed 253 characters',
  'hosts 工作线程失败': 'Hosts worker failed',
  'hosts 未同步': 'Hosts were not synchronized',
  主机地址无效: 'Invalid host address',
  '二维码图片不是有效 PNG': 'QR code image is not a valid PNG',
  二维码图片格式或大小无效: 'Invalid QR code image format or size',
  使用说明不存在: 'User guide not found',
  使用说明不是可打开的文件: 'User guide is not an accessible file',
  使用说明目录不存在: 'User guide folder not found',
  使用说明目录无效: 'Invalid user guide folder',
  使用说明站点不存在: 'User guide site not found',
  使用说明路径无效: 'Invalid user guide path',
  分享文件不存在: 'Shared file not found',
  分享文件名无效: 'Invalid shared file name',
  剪贴板工作线程失败: 'Clipboard worker failed',
  地址类型无效: 'Invalid address type',
  域名未配置到该分享项: 'Domain is not configured for this shared file',
  域名未配置到该站点: 'Domain is not configured for this site',
  导入读取工作线程失败: 'Import reader worker failed',
  导入选择器工作线程失败: 'Import picker worker failed',
  导出工作线程失败: 'Export worker failed',
  已取消: 'Canceled',
  打开使用说明工作线程失败: 'User guide opener worker failed',
  打开文件分享工作线程失败: 'Shared file opener worker failed',
  打开站点工作线程失败: 'Site opener worker failed',
  文件分享项不存在: 'Shared file entry not found',
  无法定位应用资源: 'Unable to locate app resources',
  无法离线确定局域网地址: 'Unable to determine local network address while offline',
  '旧站点运行态停止失败，且运行态恢复不完整':
    'Failed to stop previous sites; their runtime could not be fully restored',
  '旧站点运行态停止失败，配置未导入':
    'Failed to stop previous sites; configuration was not imported',
  '旧运行态停止失败，且运行态恢复不完整':
    'Failed to stop the previous runtime; it could not be fully restored',
  '旧运行态停止失败，配置未导入':
    'Failed to stop the previous runtime; configuration was not imported',
  显示分享文件工作线程失败: 'Shared file reveal worker failed',
  显示站点目录工作线程失败: 'Site folder reveal worker failed',
  未知错误: 'Unknown error',
  登录启动将在后续系统集成阶段提供: 'Launch at login is not available yet',
  登录启动设置失败: 'Failed to configure launch at login',
  目标地址无效: 'Invalid target address',
  站点不存在: 'Site not found',
  '站点配置已保存但运行态/hosts 部分失败':
    'Site configuration saved, but runtime or hosts updates partially failed',
  '站点配置已导入，但 hosts 未同步':
    'Site configuration imported, but hosts were not synchronized',
  '站点配置已导入，但自动启动部分失败':
    'Site configuration imported, but some services failed to start',
  '站点配置提交失败，且运行态恢复不完整':
    'Failed to save site configuration; runtime was not fully restored',
  缺少已配置域名: 'Configured domain is missing',
  '设置未保存，且登录启动回滚失败':
    'Settings were not saved and launch-at-login rollback failed',
  路径无效: 'Invalid path',
  '配置已保存，但 hosts 未同步': 'Configuration saved, but hosts were not synchronized',
  '配置已导入，但 hosts 未同步':
    'Configuration imported, but hosts were not synchronized',
  '配置已导入，但自动启动部分失败':
    'Configuration imported, but some services failed to start',
  '配置提交失败，且运行态恢复不完整':
    'Failed to save configuration; runtime was not fully restored',
  '链路本地 IPv6 地址缺少安全作用域': 'Link-local IPv6 address is missing a safe scope',
  不是有效文件: 'Not a valid file',
  已添加: 'Already added',
  文件名冲突: 'File name conflict',
  忽略无效路径: 'Invalid path ignored',
  文件不存在: 'File not found',
  文件检查失败: 'File validation failed',
  读取文件信息失败: 'Failed to read file information',
  文件分享任务已意外结束: 'File sharing task ended unexpectedly',
  文件分享任务结束异常: 'File sharing task failed',
  文件分享停止失败: 'Failed to stop file sharing',
  '文件分享停止超时，已强制终止任务': 'File sharing stop timed out; task was terminated',
  文件分享启动失败: 'Failed to start file sharing',
  文件分享管理器正在关闭: 'File sharing manager is shutting down',
  文件分享绑定失败: 'Failed to bind file sharing port',
  无法读取文件分享监听地址: 'Unable to read file sharing listener address',
  未添加任何文件: 'No files have been added',
  配置保存失败: 'Failed to save configuration',
  站点管理器正在关闭: 'Site manager is shutting down',
  '缺少站点 ID': 'Site ID is missing',
  '删除配置失败，且运行态恢复失败': 'Failed to delete configuration and restore runtime',
  根目录不存在或已失效: 'Root folder does not exist or is unavailable',
  根目录已失效: 'Root folder is unavailable',
  启动失败: 'Failed to start',
  停止失败: 'Failed to stop',
  站点监听入口已意外停止: 'Site listener stopped unexpectedly',
  服务任务已意外结束: 'Service task ended unexpectedly',
  '服务停止超时，已强制终止任务': 'Service stop timed out; task was terminated',
  自定义域名已被其他运行站点占用: 'Custom domain is already used by another running site',
  '80端口被占用，请解除占用或关闭本站点自定义域名后再试':
    "Port 80 is already in use. Free the port or disable this site's custom domains, then try again.",
  '无法启动自定义域名共享入口 0.0.0.0:80':
    'Unable to start the shared custom-domain listener at 0.0.0.0:80',
  无法读取监听地址: 'Unable to read listener address',
  托管块不能嵌套: 'Managed blocks cannot be nested',
  发现孤立的托管块结束标记: 'Orphaned managed block end marker found',
  '托管块内只能包含 127.0.0.1 域名行或注释':
    'Managed blocks may contain only 127.0.0.1 domain entries or comments',
  托管块内包含无效域名: 'Managed block contains an invalid domain',
  托管块内的域名行格式无效: 'Invalid domain entry format in managed block',
  托管块缺少结束标记: 'Managed block is missing its end marker',
  '无法读取 hosts 文件': 'Unable to read hosts file',
  '无法读取 hosts 备份': 'Unable to read hosts backup',
  '无法写入 hosts 备份': 'Unable to write hosts backup',
  '无法写入 hosts 文件': 'Unable to write hosts file',
  'hosts 文件操作失败': 'Hosts file operation failed',
  'hosts 备份路径无效': 'Invalid hosts backup path',
  'hosts 备份路径不是普通文件': 'Hosts backup path is not a regular file',
  'hosts 操作锁不可用': 'Hosts operation lock is unavailable',
  '没有可用的 hosts 备份': 'No hosts backup available',
  '管理员授权被取消，hosts 未修改':
    'Administrator approval canceled; hosts were not modified',
  'hosts 特权写入仅支持 macOS': 'Privileged hosts updates are only supported on macOS',
  'configVersion 必须是正整数': 'configVersion must be a positive integer',
  'settings.configVersion 必须与配置版本一致':
    'settings.configVersion must match the configuration version',
  'sites 必须是数组': 'sites must be an array',
  'v1 配置结构无效，缺少必需字段':
    'Invalid v1 configuration; required fields are missing',
  写入临时配置文件失败: 'Failed to write temporary configuration',
  创建临时文件目录失败: 'Failed to create temporary file folder',
  创建临时配置文件失败: 'Failed to create temporary configuration file',
  创建配置目录失败: 'Failed to create configuration folder',
  同步临时配置文件失败: 'Failed to sync temporary configuration file',
  同步配置目录失败: 'Failed to sync configuration folder',
  打开配置目录失败: 'Failed to open configuration folder',
  打开配置迁移锁失败: 'Failed to open configuration migration lock',
  域名重复: 'Duplicate domain',
  文件分享文件名重复: 'Duplicate shared file name',
  '文件分享条目 ID 不能为空': 'Shared file entry ID cannot be empty',
  '文件分享条目 ID 重复': 'Duplicate shared file entry ID',
  文件分享路径不能为空: 'Shared file path cannot be empty',
  文件分享路径没有文件名: 'Shared file path has no file name',
  无法创建唯一临时配置文件: 'Unable to create a unique temporary configuration file',
  无法打开临时配置文件: 'Unable to open temporary configuration file',
  替换配置文件失败: 'Failed to replace configuration file',
  '站点 ID 不能为空': 'Site ID cannot be empty',
  '站点 ID 重复': 'Duplicate site ID',
  站点导入结构无效: 'Invalid site import format',
  '站点导入配置必须是 JSON 对象': 'Site import configuration must be a JSON object',
  站点端口重复: 'Duplicate site port',
  站点配置必须是对象: 'Site configuration must be an object',
  获取配置迁移锁失败: 'Failed to acquire configuration migration lock',
  设置配置迁移锁权限失败: 'Failed to set configuration migration lock permissions',
  读取旧配置失败: 'Failed to read legacy configuration',
  读取配置备份失败: 'Failed to read configuration backup',
  读取配置文件失败: 'Failed to read configuration file',
  '配置必须是 JSON 对象': 'Configuration must be a JSON object',
  配置文件不是普通文件: 'Configuration file is not a regular file',
  '配置文件不是有效 JSON': 'Configuration file is not valid JSON',
  配置文件在读取期间发生变化: 'Configuration file changed while being read',
  配置文件必须有父目录: 'Configuration file must have a parent folder',
  配置文件读取期间超过大小限制:
    'Configuration file exceeded its size limit while being read',
  配置文件超过大小限制: 'Configuration file exceeds its size limit',
  配置文件路径在读取前发生变化: 'Configuration file path changed before reading',
  配置源无效: 'Invalid configuration source',
  配置状态锁已损坏: 'Configuration state is corrupted. Restart the app.',
  '配置结构无效，缺少必需字段': 'Invalid configuration; required fields are missing',
  '配置缺少 configVersion': 'Configuration is missing configVersion',
  'Keychain 中的试用记录损坏，无法确认试用状态，请联系支持':
    'The trial record in Keychain is damaged. Unable to verify the trial; please contact support.',
  'Keychain 拒绝访问试用记录，请检查 LocalServe 的钥匙串访问权限后重试':
    'Keychain denied access to the trial record. Check LocalServe’s keychain access permission and retry.',
  'Keychain 暂不可用，请解锁登录钥匙串后重试':
    'Keychain is temporarily unavailable. Unlock your login keychain and retry.',
  '读取 Keychain 试用记录失败，请稍后重试':
    'Failed to read the trial record from Keychain. Please retry later.',
  '保存 Keychain 试用记录失败，尚未放行试用，请稍后重试':
    'Failed to save the trial record in Keychain. Trial access has not been granted; please retry later.',
  '本地授权或旧试用记录损坏或时间无效，无法确认状态，请联系支持':
    'The local license or legacy trial record is damaged or has invalid dates. Unable to verify status; please contact support.',
  '读取本地许可证或旧试用记录失败，请检查文件访问权限后重试':
    'Failed to read the local license or legacy trial record. Check file permissions and retry.',
  '检测到系统时间明显回拨，请校正日期和时间后重试':
    'The system clock has moved significantly backwards. Correct the date and time, then retry.',
  '此平台尚不支持安全的本地试用存储，请使用已购买的许可证激活':
    'Secure local trial storage is not yet supported on this platform. Activate with your purchased license.',
  '试用记录正在被其他实例更新，请稍后重试':
    'Another instance is updating the trial record. Please retry shortly.',
  '保存本地许可证失败，请检查文件访问权限后重试':
    'Failed to save the local license. Check file permissions and retry.',
  重试授权检查: 'Retry license check',
  授权状态异常: 'License status unavailable',
  '正在确认许可证…': 'Checking license…',
  '请稍候，正在验证试用或激活状态':
    'Please wait while we verify your trial or activation.',
  试用已结束: 'Your trial has ended',
  试用结束: 'Trial ended',
  试用中: 'Free trial',
  '购买永久许可证以继续使用 LocalServe 的站点与文件分享功能':
    'Purchase a permanent license to keep using sites and file sharing.',
  永久许可证: 'Permanent license',
  一次性买断: 'One-time purchase',
  '适用{count} 台设备': 'Up to {count} devices',
  '一次性购买，无订阅': 'One-time purchase. No subscription.',
  本地站点与自定义域名: 'Local sites & custom domains',
  文件分享与局域网访问: 'File sharing & LAN access',
  '已有许可证？': 'Already have a license?',
  购买激活: 'Purchase & activate',
  粘贴许可证密钥: 'Paste license key',
  激活: 'Activate',
  许可证: 'License',
  '剩余 {days} 天': '{days}d left',
  '剩余 {hours} 小时': '{hours}h left',
  '剩余 {minutes} 分钟': '{minutes}m left',
  '剩余 {seconds} 秒': '{seconds}s left',
  '试用到期时间：{time}': 'Trial expires: {time}',
  已激活: 'Activated',
  激活状态: 'Activation status',
  '已达到 3 台设备上限，请联系作者释放设备名额':
    'This license is already active on 3 devices. Contact the author to free a device slot.',
  需要网络才能激活: 'An internet connection is required to activate.',
  许可证无效: 'Invalid license key',
  激活失败: 'Activation failed',
  刷新许可证失败: 'Failed to refresh license',
  无法打开购买页面: 'Unable to open checkout',
  离线使用中: 'Working offline',
  '本次未能联网确认授权，许可证不受影响，联网后会自动确认':
    'The activation could not be confirmed online. Your license is unaffected; it will be confirmed automatically when a connection returns.',
  '试用已结束，请购买激活': 'Your trial has ended. Purchase a license to activate.',
  '无法连接许可证服务器，请稍后重试':
    'Unable to reach the license server. Please retry later.',
  打开结账页工作线程失败: 'Checkout opener worker failed',
}

const singularMessages: Readonly<Record<string, string>> = {
  '{count} 条': '{count} rule',
  '{count} 个域名': '{count} domain',
}

/** Keep dynamic values (names, paths, URLs, and diagnostic details) intact. */
export function translate(
  language: Language,
  message: string,
  params: TranslationParams = {},
): string {
  const template =
    language === 'en'
      ? ((params.count === 1 && hasOwn(singularMessages, message)
          ? singularMessages[message]
          : undefined) ??
        englishTranslation(message) ??
        translateMessage(language, message))
      : message
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    hasOwn(params, key) ? String(params[key]) : placeholder,
  )
}

/** Toasts may include a diagnostic suffix from the native runtime. */
export function translateMessage(language: Language, message: string): string {
  if (language === 'zh') return message
  const exact = englishTranslation(message)
  if (exact) return exact
  const occupied = /^端口 (\d+) 已被占用(.*)$/.exec(message)
  if (occupied) {
    const owner = occupied[2]
      .replace(/^，占用进程 PID (\d+)$/, ', process PID $1')
      .replace(/^，占用进程 (.*) \(PID (\d+)\)$/, ', process $1 (PID $2)')
    return `Port ${occupied[1]} is already in use${owner}`
  }
  const sitePort = /^端口 (\d+) 已被其他站点占用$/.exec(message)
  if (sitePort) return `Port ${sitePort[1]} is already used by another site`
  const batch = /^(\d+) 个站点操作失败$/.exec(message)
  if (batch) return `Site operations failed: ${batch[1]}`
  const futureVersion = /^不支持的未来配置版本 (\d+)$/.exec(message)
  if (futureVersion)
    return `Configuration version ${futureVersion[1]} is newer than this app supports`
  const version = /^不支持的配置版本 (\d+)$/.exec(message)
  if (version) return `Unsupported configuration version ${version[1]}`
  const coded = /^(.+失败)（([^）]+)）$/.exec(message)
  if (coded) {
    const translatedAction = englishTranslation(coded[1])
    if (translatedAction) return `${translatedAction} (${coded[2]})`
  }
  const separator = /：|: /.exec(message)
  if (separator) {
    const prefix = message.slice(0, separator.index)
    const detail = message.slice(separator.index + separator[0].length)
    if (prefix === '已添加，部分跳过')
      return translate(language, '已添加，部分跳过：{detail}', {
        detail: translateMessage(language, detail),
      })
    const translatedPrefix = englishTranslation(prefix)
    if (translatedPrefix)
      return `${translatedPrefix}: ${translateMessage(language, detail)}`
  }
  const skipped = /^(.*)：(不是有效文件|已添加|文件名冲突)$/.exec(message)
  if (skipped) return `${skipped[1]}: ${englishMessages[skipped[2]]}`
  return message
}

function englishTranslation(message: string): string | undefined {
  return hasOwn(englishMessages, message) ? englishMessages[message] : undefined
}
