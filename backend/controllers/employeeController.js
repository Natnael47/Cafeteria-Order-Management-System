// Login employee
export const loginEmployee = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if employee exists
    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Generate token
    const token = createToken(employee.id);
    res.json({ success: true, token });
  } catch (error) {
    console.log("Error logging in employee:", error);
    res.json({ success: false, message: error.message });
  }
};
