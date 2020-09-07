---
date: 2020-09-07 07:23:43
tags:
- ansible
---

# Ansible 学习笔记

ansible 是一个自动化运维工具，是 python 编写的利用 ssh 连接实现的

<!-- more -->

- 批量控制集群
- 编写剧本自动化

## ansible 入门

1. master 机安装 openssh、python、ansible、sshpass，client 机安装 openssh、python
2. 编辑 `/etc/ansible/hosts` 添加 client 机 ip
3. `export ANSIBLE_HOST_KEY_CHECKING=False` 关闭 know_hosts 检查
4. `ansible xxx.xxx.xxx.xxx -m ping -k` 测试

## ansible 架构

## ansible 配置

ansible 集群中的机子分为主控机 master 和客户机 client

### ansible 全局配置

ansible 的配置文件在 `/etc/ansible/ansible.cfg` 家目录下的 `.ansible.cfg` 也会生效，常用配置项：

```
[defaults]
inventory = /etc/ansible/hosts # 自定义清单文件路径
host_key_checking = False # 关闭远程主机key检查
forks = 5 # 并发数
log_path = /var/log/ansible.log # 记录日志
```

### 主机清单配置

添加 client 机的 ip 到 maser 机 `/etc/ansible/hosts`

```
[_group-name]
xxx.xxx.xxx.xxx
xxx.xxx.xxx.xxx

[_group-name:children]
_group-name
_group-name

[_group-name:vars]
xxx = xxx
xxx = xxx
```

> 该文件可以自定义配置路径，在 [defaults] 下 `inventory = /xxx/xxx/hosts`

> 但是光写这些还不够，因为底层是通过 ssh 实现的，所以需要进行可信配置和免密配置

#### 可信配置

需要让 master 机信任 client 机，即 ssh 初次连接的 yes 机制

- ssh 扫描命令 `ssh-keyscan xxx xxx` 比较麻烦
- 使用 ansible 的 known_hosts 模块
- 修改环境变量 `export ANSIBLE_HOST_KEY_CHECKING=False`
- 修改 ansible 配置，去掉相关注释 `host_key_checking = False`

#### 免密配置

登陆 client 机需要密码，但总不能每次到手动输入

- ssh 免密命令 `ssh-copy-id`
- 使用 ansible 的 authenticate_id 模块
- 在清单文件中配置 ansible_ssh_user 、 ansible_ssh_pass 和 ansible_sudo_pash 变量

## ansible 常用模块

### ping

- data 响应字符串

### command

- cmd 命令名
- chdir 上下文路径

### shell

- cmd
- chdir

### copy

- src
- dest
- owner
- group
- mode

### file

- path
- owner
- group
- mode
- state 状态 link 表示连接
- src 表示 link 的目标

### script

- cmd 本地脚本路径
- chdir 远程执行上下文路径

### user

- user 用户名
- state 状态 absent 表示删除用户

### service

- name 服务名
- state 服务状态 started/stoped

## ansible Playbook

```yaml
---
- hosts: xxx
  remote_user: xxx
  vars:
    _key: _value # {{ _key }} 引用
  tasks: # 任务列表
  - name: xxx
    _module: xxx
    _moduel:
      xxx: xxx
    notify:
    - _notify-name
    - _notify-name
    template:
      src: xxx
      dest: xxx
# ----template----
#{% for xxx in xxxs %}
# 引用 {{ xxx }}
#{% endfor %}
#
#{% if xxx is defined %}
# 引用 {{ xxx }}
#{% endif %}
# ----------------
    
    with_items: # {{ item }} 引用
    - item1
    - item2

  handlers:
    - name: xxx
      ...
```

## ansible Role

采用目录组织 playbook 进行模块化编写

```
# 结构
_playbook.yaml
roles
\-- _role
  |-- tasks
  | |-- main.yaml # 使用import_task引入
  | \-- _task.yaml
  |-- vars
  | \-- main.yaml
  \-- handlers
    |-- main.yaml
    \-- _handler.yaml
```

```yaml
# playbook
- hosts:
  - xxx
  - xxx
  remote_user: xxx
  pre_tasks:
  - ...
  roles:
  - _role
  post_tasks:
  - ...
```

## ansible 命令

```sh
$ ansible-doc -l # 显示模块列表
$ ansible-doc _module-name # 显示模块帮助
$ ansible _group-name --list # 列出组清单
$ ansible _group-name/all -u xxx -k -b --become-user=xxx -K -m _module-name -a xxx
$ ansible-playbook xxx.yaml
```

