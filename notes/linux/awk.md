# awk

```bash
awk PROGRAM FILE
awk -v VAR="VALUE" PROGRAM FILE # 预定义变量
awk -F SEP PROGRAM FILE # 指定分割符，支持正则
awk -f PROGFILE FILE # 从文件中读取awk程序
COMMAND | awk PROGRAM # 从标准输入中读取
```

PROGRAM

```awk
PATTERN { ACTION }
PATTERN { ACTION }
...
```

PATTERN 默认为空，即无条件

- *EXPRESSION*
  - **BEGIN**
  - **END**
- /*REGEXP*/ 等价于 $0 ~ /*REGEXP*/

ACTION 默认为 print $0

## 内置变量

- NR: 当前行数
- FS: 字段分隔符，默认是空格和制表符
- $0: 一整行
- $N: 第N个字段
- NF: 字段总数，可以和`$`配合，如`$NF`、`$(NF-1)`
- OFS: 输出字段的分隔符，用于打印时分隔字段，默认为空格

## 内置函数

- length(STRING): 返回字符串长度
- substr(STRING, start, length): 字符串截取，`start`从1开始计数

## 转义实践

```bash
awk 'BEGIN { print "Here is a single quote <'"'"'>" }'
awk 'BEGIN { print "Here is a single quote <'\''>" }'
awk "BEGIN { print \"Here is a single quote <'>\" }"
awk 'BEGIN { print "Here is a single quote <\47>" }'
awk -v sq="'" 'BEGIN { print "Here is a single quote <" sq ">" }'
```
