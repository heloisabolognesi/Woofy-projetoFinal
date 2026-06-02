export function StatsSection() {
  const stats = [
    { label: "Pets cadastrados", value: "10.000", suffix: "+" },
    { label: "Empresas atendidas", value: "500", suffix: "+" },
    { label: "Agendamentos realizados", value: "50.000", suffix: "+" },
    { label: "Satisfação", value: "98", suffix: "%" },
  ]

  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-[#305165] flex items-center justify-center">
                <span>{stat.value}</span>
                <span className="text-[#5E929F]">{stat.suffix}</span>
              </div>
              <p className="text-[#6B7280] font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
