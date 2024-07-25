# Bash

## 变量

```bash
VAR="abc/def/ghi/jkl/mno"
echo ${#VAR} # 18
echo ${VAR:8} # ghi/jkl/mno
echo ${VAR:0-8} # /jkl/mno
echo ${VAR:8:3} # ghi
echo ${VAR#*/} # def/ghi/jkl/mno
echo ${VAR##*/} # mno
echo ${VAR%/*} # abc/def/ghi/jkl
echo ${VAR%%/*} # abc
unset VAR
echo ${VAR:-default} # default
echo ${VAR:=default} # default (VAR is 'default' now)
echo ${VAR:+default2} # default2
```

## 控制序列

```bash
# \033[x;x;...m
# \x1b[x;x;...m
# \e[x;x;...m

printf '\033[0m' # 重置
printf '\033[1m' # 粗体
printf '\033[2m' # 细体
printf '\033[3m' # 斜体
printf '\033[4m' # 下划线
printf '\033[5m' # 闪烁
printf '\033[7m' # 反色
printf '\033[8m' # 隐藏
printf '\033[39m' # 默认前景色
printf '\033[30m' # 黑前景色
printf '\033[31m' # 红前景色
printf '\033[32m' # 绿前景色
printf '\033[33m' # 黄前景色
printf '\033[34m' # 蓝前景色
printf '\033[35m' # 洋前景色
printf '\033[36m' # 青前景色
printf '\033[37m' # 白前景色
printf '\033[90m' # 亮黑前景色
printf '\033[91m' # 亮红前景色
printf '\033[92m' # 亮绿前景色
printf '\033[93m' # 亮黄前景色
printf '\033[94m' # 亮蓝前景色
printf '\033[95m' # 亮洋前景色
printf '\033[96m' # 亮青前景色
printf '\033[97m' # 亮白前景色
printf '\033[49m' # 默认背景色
printf '\033[40m' # 黑背景色
printf '\033[41m' # 红背景色
printf '\033[42m' # 绿背景色
printf '\033[43m' # 黄背景色
printf '\033[44m' # 蓝背景色
printf '\033[45m' # 洋背景色
printf '\033[46m' # 青背景色
printf '\033[47m' # 白背景色
printf '\033[100m' # 亮黑背景色
printf '\033[101m' # 亮红背景色
printf '\033[102m' # 亮绿背景色
printf '\033[103m' # 亮黄背景色
printf '\033[104m' # 亮蓝背景色
printf '\033[105m' # 亮洋背景色
printf '\033[106m' # 亮青背景色
printf '\033[107m' # 亮白背景色
```
