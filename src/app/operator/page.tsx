import { OperatorHome } from "@/components/operator-home";
import { OperatorGuard } from "@/components/operator-guard";

export default function OperatorPage() {
  return (
    <OperatorGuard>
      <OperatorHome />
    </OperatorGuard>
  );
}
