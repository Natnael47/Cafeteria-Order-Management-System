import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper functions to calculate specific data
const getTopSellingItems = async (dateFilter) => {
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: { date: { gte: new Date(dateFilter) } }, // Use the `order.date` field for filtering
    },
    include: {
      food: { select: { name: true } },
      Drink: { select: { drink_Name: true } },
    },
  });

  const itemCounts = orderItems.reduce((acc, item) => {
    const key = item.food?.name || item.Drink?.drink_Name;
    acc[key] = (acc[key] || 0) + item.quantity;
    return acc;
  }, {});

  return Object.entries(itemCounts).map(([name, count]) => ({ name, count }));
};

const getInventoryToExpireSoon = async (dateFilter) => {
  return prisma.inventory.findMany({
    where: {
      expiryDate: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      quantity: { gt: 0 },
    },
    select: {
      name: true,
      quantity: true,
      expiryDate: true,
    },
  });
};

const getInventoryWithdrawals = async (dateFilter) => {
  return prisma.withdrawallog.findMany({
    where: { dateWithdrawn: { gte: new Date(dateFilter) } },
    include: { inventory: { select: { name: true } } },
  });
};

const getEmployeeWorkLogs = async (dateFilter) => {
  return prisma.workLog.findMany({
    where: { loginTime: { gte: new Date(dateFilter) } },
    include: {
      employee: { select: { firstName: true, lastName: true } },
    },
  });
};

const getOrdersTotalIncome = async (dateFilter) => {
  const orders = await prisma.order.findMany({
    where: { date: { gte: new Date(dateFilter) } },
    select: { amount: true },
  });

  return orders.reduce((total, order) => total + order.amount, 0);
};

const getChefOrderSummary = async (dateFilter) => {
  const chefOrders = await prisma.order.findMany({
    where: {
      date: { gte: new Date(dateFilter) },
      chefId: { not: null },
    },
    select: {
      chefId: true,
      totalPrepTime: true,
    },
  });

  const chefSummary = chefOrders.reduce((acc, order) => {
    acc[order.chefId] = acc[order.chefId] || { orderCount: 0, totalTime: 0 };
    acc[order.chefId].orderCount += 1;
    acc[order.chefId].totalTime += order.totalPrepTime;
    return acc;
  }, {});

  return Object.entries(chefSummary).map(
    ([chefId, { orderCount, totalTime }]) => ({
      chefId,
      orderCount,
      totalTime,
      avgTime: totalTime / orderCount,
    })
  );
};

const getLowStockInventory = async () => {
  return prisma.inventory.findMany({
    where: { quantity: { lte: 10 } },
    select: {
      name: true,
      quantity: true,
    },
  });
};

// Main report function
const getReportsByTimePeriod = async (req, res) => {
  const { timePeriod } = req.body;
  let dateFilter;
  const currentDate = new Date();

  if (timePeriod === "daily") {
    dateFilter = currentDate.setDate(currentDate.getDate() - 1);
  } else if (timePeriod === "weekly") {
    dateFilter = currentDate.setDate(currentDate.getDate() - 7);
  } else if (timePeriod === "monthly") {
    dateFilter = currentDate.setMonth(currentDate.getMonth() - 1);
  } else if (timePeriod === "yearly") {
    dateFilter = currentDate.setFullYear(currentDate.getFullYear() - 1);
  }

  try {
    const topSellingItems = await getTopSellingItems(dateFilter);
    const inventoryToExpireSoon = await getInventoryToExpireSoon(dateFilter);
    const inventoryWithdrawals = await getInventoryWithdrawals(dateFilter);
    const employeeWorkLogs = await getEmployeeWorkLogs(dateFilter);
    const ordersTotalIncome = await getOrdersTotalIncome(dateFilter);
    const chefOrderSummary = await getChefOrderSummary(dateFilter);
    const lowStockInventory = await getLowStockInventory();

    res.status(200).json({
      success: true,
      data: {
        topSellingItems,
        inventoryToExpireSoon,
        inventoryWithdrawals,
        employeeWorkLogs,
        ordersTotalIncome,
        chefOrderSummary,
        lowStockInventory,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(500)
      .json({ success: false, message: "Error generating report" });
  }
};

// Export the function
export { getReportsByTimePeriod };
