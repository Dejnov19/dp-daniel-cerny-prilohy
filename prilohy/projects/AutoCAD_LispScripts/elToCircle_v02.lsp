(defun c:el2cir ( / selSet i ent entObj center diameter layerName doc ms circle minPt maxPt sourceColor )
  (vl-load-com)

  ;; Zadej průměr nové kružnice krrr
  (initget 7) ; (zabraňuje zadání nuly, záporného čísla nebo prázdného vstupu)
  (setq diameter (getreal "\nZadejte průměr kružnice (v jednotkách): "))

  ;; Výběr elipsy
  (princ "\nVyberte objekty obsahující elipsy:")
  (setq selSet (ssget '((0 . "ELLIPSE"))))

  (if selSet
    (progn
      (setq doc (vla-get-ActiveDocument (vlax-get-acad-object)))
      (setq ms (vla-get-ModelSpace doc))
      (setq i 0)
      
      ;; Vypnutí překreslování pro zrychlení skriptu
      (vla-StartUndoMark doc)

      (while (< i (sslength selSet))
        (setq ent (ssname selSet i))
        (setq entObj (vlax-ename->vla-object ent))

        ;; 1. Převzít hladinu
        (setq layerName (vla-get-layer entObj))

        ;; 2. Převzít KOMPLETNÍ definici barvy (ActiveX objekt)
        ;; Toto funguje pro RGB, ACI i DleHladiny spolehlivě
        (setq sourceColor (vla-get-TrueColor entObj))

        ;; 3. Výpočet středu přes bounding box
        (vla-getboundingbox entObj 'minPt 'maxPt)
        (setq minPt (vlax-safearray->list minPt))
        (setq maxPt (vlax-safearray->list maxPt))
        (setq center (mapcar '(lambda (a b) (/ (+ a b) 2.0)) minPt maxPt))

        ;; 4. Smazat původní elipsu
        (vla-delete entObj)

        ;; 5. Vytvořit novou kružnici
        (setq circle (vla-AddCircle ms (vlax-3d-point center) (/ diameter 2.0)))
        
        ;; 6. Aplikovat vlastnosti na kružnici
        (vla-put-layer circle layerName)
        (vla-put-TrueColor circle sourceColor) ; Zde se aplikuje zkopírovaná barva

        (setq i (1+ i))
      )
      
      (vla-EndUndoMark doc)
      (princ (strcat "\nNahrazeno " (itoa i) " elips objektů kružnicemi se zachovanou barvou."))
    )
    (princ "\nNebyla nalezena žádná elipsa.")
  )
  (princ)
)