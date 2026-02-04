const Valentine = require("../models/valantine.model.js");



exports.createValentineOrder = async (req, res) => {

    const { name, note, email, phone } = req.body;

    try {


        //BASIC VALIDATION 
        let missingFields = [];

        if (!name) missingFields.push("name");
        if (!note) missingFields.push("note");
        if (!email) missingFields.push("emial");
        if (!phone) missingFields.push("phone");

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: " + missingFields.join(", "),
            });
        }


        //CREATE NEW VALENTINE ORDER
        const newValentineOrder = new Valentine({
            name,
            note,
            email,
            phone
        });


        //SAVE TO DB
        const savedOrder = await newValentineOrder.save();
        return res.status(201).json({
            success: true,
            message: "Valentine order created successfully",
            data: savedOrder,
        });




    } catch (error) {

        console.error("Error creating valentine order:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error: Unable to create valentine order",
        });

    }
}