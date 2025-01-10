import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getInventoryRequestsAndWithdrawals = async (req, res) => {
  try {
    const requestsAndWithdrawals = await prisma.inventoryrequest.findMany({
      include: {
        inventory: { select: { name: true, quantity: true } },
        employee: { select: { firstName: true, lastName: true } },
        withdrawallog: {
          select: { quantity: true, reason: true, dateWithdrawn: true },
        },
      },
      orderBy: { dateRequested: "desc" },
    });

    res.status(200).json({
      success: true,
      data: requestsAndWithdrawals,
    });
  } catch (error) {
    console.error("Error fetching requests and withdrawals:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching requests and withdrawals",
    });
  }
};

const getInventoryOverview = async (req, res) => {
  try {
    const inventoryOverview = await prisma.inventory.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        quantity: true,
        unit: true,
        pricePerUnit: true,
        status: true,
        expiryDate: true,
      },
      orderBy: { id: "asc" },
    });

    res.status(200).json({
      success: true,
      data: inventoryOverview,
    });
  } catch (error) {
    console.error("Error fetching inventory overview:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inventory overview",
    });
  }
};

const getRecentPurchases = async (req, res) => {
  try {
    const recentPurchases = await prisma.inventorypurchase.findMany({
      orderBy: { purchaseDate: "desc" },
      take: 10,
      include: {
        inventory: { select: { name: true, quantity: true } },
        supplier: { select: { name: true, email: true } },
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    res.status(200).json({
      success: true,
      data: recentPurchases,
    });
  } catch (error) {
    console.error("Error fetching recent purchases:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent purchases",
    });
  }
};

const getEmployeeList = async (req, res) => {
  try {
    const employeeList = await prisma.employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
        salary: true,
        shift: true,
      },
    });

    res.status(200).json({
      success: true,
      data: employeeList,
    });
  } catch (error) {
    console.error("Error fetching employee list:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching employee list",
    });
  }
};

const getWorkLogs = async (req, res) => {
  try {
    const workLogs = await prisma.workLog.findMany({
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
      orderBy: { loginTime: "desc" },
    });

    res.status(200).json({
      success: true,
      data: workLogs,
    });
  } catch (error) {
    console.error("Error fetching work logs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching work logs",
    });
  }
};

const getOrderSummary = async (req, res) => {
  try {
    const orderSummary = await prisma.order.findMany({
      select: {
        id: true,
        amount: true,
        status: true,
        serviceType: true,
        isPaid: true,
      },
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      data: orderSummary,
    });
  } catch (error) {
    console.error("Error fetching order summary:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order summary",
    });
  }
};

const getOrderedItems = async (req, res) => {
  try {
    const orderedItems = await prisma.orderItem.findMany({
      include: {
        food: { select: { name: true, price: true } },
        Drink: { select: { drink_Name: true, drink_Price: true } },
      },
      orderBy: { orderId: "desc" },
    });

    res.status(200).json({
      success: true,
      data: orderedItems,
    });
  } catch (error) {
    console.error("Error fetching ordered items:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching ordered items",
    });
  }
};

const getSupplierDetails = async (req, res) => {
  try {
    const supplierDetails = await prisma.supplier.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        contactInfo: true,
        status: true,
      },
    });

    res.status(200).json({
      success: true,
      data: supplierDetails,
    });
  } catch (error) {
    console.error("Error fetching supplier details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching supplier details",
    });
  }
};

const getSupplierProducts = async (req, res) => {
  try {
    const supplierProducts = await prisma.inventorySupplier.findMany({
      include: {
        inventory: {
          select: { name: true, quantity: true, pricePerUnit: true },
        },
        supplier: { select: { name: true } },
      },
    });

    res.status(200).json({
      success: true,
      data: supplierProducts,
    });
  } catch (error) {
    console.error("Error fetching supplier products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching supplier products",
    });
  }
};

const getSupplierOrders = async (req, res) => {
  try {
    const supplierOrders = await prisma.supplierorder.findMany({
      include: {
        inventory: { select: { name: true, quantityOrdered: true } },
        supplier: { select: { name: true } },
      },
      orderBy: { orderDate: "desc" },
    });

    res.status(200).json({
      success: true,
      data: supplierOrders,
    });
  } catch (error) {
    console.error("Error fetching supplier orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching supplier orders",
    });
  }
};

const getReportsByTimePeriod = async (req, res) => {
  const { timePeriod } = req.body; // Time period: daily, weekly, monthly, yearly

  // Define date filters based on time period
  let dateFilter;
  const currentDate = new Date();

  if (timePeriod === "daily") {
    dateFilter = currentDate.setDate(currentDate.getDate() - 1); // 1 day ago
  } else if (timePeriod === "weekly") {
    dateFilter = currentDate.setDate(currentDate.getDate() - 7); // 7 days ago
  } else if (timePeriod === "monthly") {
    dateFilter = currentDate.setMonth(currentDate.getMonth() - 1); // 1 month ago
  } else if (timePeriod === "yearly") {
    dateFilter = currentDate.setFullYear(currentDate.getFullYear() - 1); // 1 year ago
  }

  try {
    // Fetch Inventory Overview Data
    const inventoryOverview = await prisma.inventory.findMany({
      where: { dateReceived: { gte: new Date(dateFilter) } },
      select: {
        id: true,
        name: true,
        category: true,
        quantity: true,
        unit: true,
        pricePerUnit: true,
        status: true,
        expiryDate: true,
      },
    });

    // Fetch Employee Reports
    const employeeWorkLogs = await prisma.workLog.findMany({
      where: { loginTime: { gte: new Date(dateFilter) } },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    // Fetch Orders Overview
    const orderSummary = await prisma.order.findMany({
      where: { date: { gte: new Date(dateFilter) } },
      select: {
        id: true,
        amount: true,
        serviceType: true,
        isPaid: true,
        status: true,
      },
    });

    // Fetch Supplier Overview
    const supplierDetails = await prisma.supplier.findMany({
      where: { dateAdded: { gte: new Date(dateFilter) } },
      select: {
        id: true,
        name: true,
        email: true,
        contactInfo: true,
        status: true,
      },
    });

    // Response structure
    res.status(200).json({
      success: true,
      data: {
        inventoryOverview,
        employeeWorkLogs,
        orderSummary,
        supplierDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching report data",
    });
  }
};

// Export all functions
export {
  getEmployeeList,
  getInventoryOverview,
  getInventoryRequestsAndWithdrawals,
  getOrderedItems,
  getOrderSummary,
  getRecentPurchases,
  getReportsByTimePeriod,
  getSupplierDetails,
  getSupplierOrders,
  getSupplierProducts,
  getWorkLogs,
};
