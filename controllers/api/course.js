const { json } = require("express");
const Courses = require("../../models/courses");

module.exports = {
    index: (req, res) => {
        Courses.where('isActive').equals('true')
        .then(courses => {
            // console.log(courses)
            res.json(courses)
        })
            .catch(errors => {
                res.json({ error: error })
            })
    },
    show: (req, res) => {
        let courseId = req.params.courseId;
        course.findById(courseId)
            .then(course => {
                res.json({ course })
            })
            .catch(error => {
                res.json({ error: error })
            })
    },
    update: (req, res) => {
        let courseId = req.params.courseId
        let storeInfo = {
            name: req.body.name,
            products: req.body.products,
            storeId: req.body.storeId,
            managerId: req.manager.managerId,
            isActive: req.subsrciprions.endDate,
        }
        store.findByIdAndUpdate(courseId, { $set: storeInfo })
            .then(course => {
                res.json({ message: "course info has been updated" })

            })
            .catch(error => {
                res.json({ error: error })
            })
    },
    delete: (req, res) => {
        let courseId = req.params.courseId
        course.findByIdAndRemove(courseId)
            .then(() => {
                res.json({ message: "course is deleted" })
            })
            .catch(error => {
                res.json({ error: error })
            })
    },
    create: (req, res) => {
        let newCustomer = new store({
            name: req.body.name,
            products: req.body.products,
            courseId: req.body.courseId,
            managerId: req.manager.managerId,
            isActive: req.subsrciprions.endDate
        })
        course.register(newCustomer, (error, course) => {
            if (course) {
                res.json({ message: "New course created!" })
            } else {
                res.json({ error: error })
            }
        })
    }
}