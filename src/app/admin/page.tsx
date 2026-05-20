import AdminClient from "./AdminClient";

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <p
          style={{ color: "#BFFF00", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          className="mb-2"
        >
          Restricted Access
        </p>
        <h1
          style={{ fontFamily: "var(--font-bebas)", fontSize: "4rem", letterSpacing: "0.02em", lineHeight: 1 }}
        >
          ADMIN
        </h1>
        <p style={{ color: "#555", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          Enter match results and manage league data
        </p>
      </div>

      <AdminClient />
    </div>
  );
}
