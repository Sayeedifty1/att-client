 const handleSubmit = async () => {
        const attendanceInfo = studentsData.map(student => {
            const dates = Array.from(new Set(attendanceData.matchedData.filter(data => data.course === courseName).map(data => data.Date)));
            const presentDays = dates.filter(date => attendanceData.matchedData.find(data => data.Date === date && Object.values(data).includes(student.fingerprint))).length;
            console.log(presentDays)
            const percentage = dates.length > 0 ? (presentDays / dates.length) * 100 : 0;
            console.log(percentage)
            return {
                courseName,
                name: student.name,
                id: student.id,
                totalClasses: dates.length,
                totalPresentDays: presentDays,
                percentage: percentage.toFixed(1),
                totalMarks: percentage / 10
            };

        });
        console.log(attendanceInfo)

        try {
            const response = await fetch(`${import.meta.env.VITE_IP}/student-att-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(attendanceInfo)
            });

            if (!response.ok) {
                alert('Failed to submit attendance data')
                throw new Error('Failed to send attendance data');
            }
            alert('Attendance data submitted successfully')
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error sending attendance data:', error);
        }
    };
