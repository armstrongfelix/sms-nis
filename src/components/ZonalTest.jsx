import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase"

export default function ZonalTest() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStaff() {
      try {
        setLoading(true)
        setError(null)
        const q = query(collection(db, "staff"), where("zone", "==", "ZONEE"))
        const snapshot = await getDocs(q)
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setStaff(list)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStaff()
  }, [])

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>

  const allKeys = staff.length > 0
    ? Object.keys(staff[0]).filter((k) => k !== "id")
    : []

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-nis-primary">Zonal Test - ZONEE Staff</h1>
      <p className="text-sm text-gray-500">{staff.length} record(s) found</p>

      {staff.length === 0 ? (
        <p className="text-gray-400">No staff found with zone = ZONEE.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-nis-primary font-semibold">
              <tr>
                <th className="px-4 py-3">S/N</th>
                {allKeys.map((key) => (
                  <th key={key} className="px-4 py-3 whitespace-nowrap">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5">{i + 1}</td>
                  {allKeys.map((key) => (
                    <td key={key} className="px-4 py-2.5 whitespace-nowrap max-w-xs truncate" title={s[key]}>
                      {s[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
