import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

enum BarrierState {
  CLOSED = "closed",
  OPENING = "opening",
  OPEN = "open",
  CLOSING = "closing",
}

interface BarrierStatus {
  state: BarrierState;
  message: string;
}

const AUTO_CLOSE_DELAY = 30000;

const useBarrierControl = (): [BarrierStatus, () => void] => {
  const [status, setStatus] = useState<BarrierStatus>({
    state: BarrierState.CLOSED,
    message: "Шлагбаум закрыт",
  });

  const { toast } = useToast();

  const openBarrier = () => {
    if (status.state === BarrierState.CLOSED) {
      setStatus({
        state: BarrierState.OPENING,
        message: "Шлагбаум открывается...",
      });
      toast({
        title: "Управление шлагбаумом",
        description: "Шлагбаум открывается...",
      });

      setTimeout(() => {
        setStatus({ state: BarrierState.OPEN, message: "Шлагбаум открыт" });
        toast({
          title: "Управление шлагбаумом",
          description: "Шлагбаум открыт",
        });

        setTimeout(() => {
          setStatus({
            state: BarrierState.CLOSING,
            message: "Шлагбаум закрывается...",
          });
          toast({
            title: "Управление шлагбаумом",
            description: "Шлагбаум закрывается...",
          });

          setTimeout(() => {
            setStatus({
              state: BarrierState.CLOSED,
              message: "Шлагбаум закрыт",
            });
            toast({
              title: "Управление шлагбаумом",
              description: "Шлагбаум закрыт",
            });
          }, 5000);
        }, AUTO_CLOSE_DELAY);
      }, 5000);
    }
  };

  return [status, openBarrier];
};

export default useBarrierControl;
