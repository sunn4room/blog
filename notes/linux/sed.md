# sed

> 推荐使用`sed -E`

```bash
sed -E SCRIPT FILE
sed -E -e SCRIPT FILE
sed -E -f SCRFILE FILE # 从文件中读取脚本
sed -E -n SCRIPT FILE # 仅显示script处理后的结果
sed -E -i SCRIPT FILE # 修改源文件
```

## SCRIPT

`[addr][operation]`

### addr

| addr | 描述 |
| --- | --- |
| `1` | 第一行 |
| `$` | 最后一行 |
| `1-3,5-7` | 一至三，五至七行 |
| `/xxx/` | 正则匹配行 |

### operation

| operation | 描述 |
| --- | --- |
| `axxx` | 下插 |
| `a\ xxx` | 下插(行首含空格) |
| `ixxx` | 上插 |
| `i\ xxx` | 上插(行首含空格) |
| `cxxx` | 修改 |
| `c\ xxx` | 修改(行首含空格) |
| `d` | 删除 |
| `s/xxx/xxx/` | 替换 |
| `s/xxx/xxx/g` | 全替换 |
| `p` | 打印 |

