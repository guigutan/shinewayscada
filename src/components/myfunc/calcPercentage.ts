/**
 * 计算两数相除的百分比，保留一位小数
 * @param numerator 分子（被除数），支持数字或数字字符串
 * @param denominator 分母（除数），支持数字或数字字符串
 * @returns 格式化后的百分比字符串（如 "66.7%"）
 */
export const calcPercentage = (
  numerator: number | string,
  denominator: number | string
): string => {
  // 转换为数字类型，避免字符串运算
  const num = Number(numerator);
  const den = Number(denominator);

  // 处理边界：分母为0、数值非有效数字时，返回0.0%
  if (isNaN(num) || isNaN(den) || den === 0) {
    return '0.0%';
  }

  // 计算百分比并保留一位小数（四舍五入）
  const percentage = (num / den) * 100;
  // toFixed(1) 会保留一位小数，返回字符串
  return `${percentage.toFixed(1)}%`;
};

// 可选：如果需要默认导出，也可以添加
export default calcPercentage;